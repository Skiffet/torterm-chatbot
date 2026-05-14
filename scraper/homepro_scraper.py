import asyncio
import json
import re
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Page, TimeoutError as PlaywrightTimeout
from tqdm import tqdm

from categories import EXTERIOR_CATEGORIES

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

SCROLL_PAUSE = 0.8
MAX_SCROLL_ROUNDS = 40
DELAY_BETWEEN_PRODUCTS = 1.2
PRODUCTS_PER_CATEGORY = 10  # จำกัดจำนวนสินค้าต่อหมวดหมู่


def parse_price(text: str) -> Optional[str]:
    """Extract numeric price string from messy text."""
    if not text:
        return None
    text = text.replace("\xa0", "").replace(",", "")
    m = re.search(r"[\d]+(?:\.\d+)?", text)
    return m.group() if m else text.strip()


async def scroll_to_load_all(page: Page) -> None:
    """Scroll page until no new content loads (infinite scroll)."""
    prev_count = 0
    stale_rounds = 0
    for _ in range(MAX_SCROLL_ROUNDS):
        await page.evaluate("window.scrollBy(0, window.innerHeight * 1.5)")
        await page.wait_for_timeout(int(SCROLL_PAUSE * 1000))
        count = await page.evaluate(
            "document.querySelectorAll('a[href*=\"/p/\"]').length"
        )
        if count == prev_count:
            stale_rounds += 1
            if stale_rounds >= 3:
                break
        else:
            stale_rounds = 0
        prev_count = count


async def get_product_links(page: Page, category_url: str) -> list[str]:
    await page.goto(category_url, wait_until="domcontentloaded", timeout=30000)
    await page.wait_for_timeout(3000)
    await scroll_to_load_all(page)
    links = await page.evaluate("""() =>
        [...new Set([...document.querySelectorAll('a')].map(a => a.href).filter(h => h.includes('/p/')))]
    """)
    return links


async def scrape_product(page: Page, url: str, category_name: str) -> Optional[dict]:
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1800)

        product: dict = {"url": url, "category": category_name}

        # Name
        h1 = await page.query_selector("h1")
        product["name"] = (await h1.inner_text()).strip() if h1 else None

        # Current price
        price_el = await page.query_selector(".discount-price")
        product["price"] = parse_price(await price_el.inner_text() if price_el else "")

        # Original price
        orig_el = await page.query_selector(".original-price")
        product["original_price"] = parse_price(await orig_el.inner_text() if orig_el else "")

        # SKU - element contains "SKU: XXXXXXX"
        sku_el = await page.query_selector(".prd-sku-sale-by, .prd-sku")
        if sku_el:
            raw = await sku_el.inner_text()
            m = re.search(r"SKU[:\s]+(\S+)", raw)
            product["sku"] = m.group(1) if m else raw.strip()
        else:
            product["sku"] = None

        # Brand — inside spec tab or dedicated brand element
        brand_el = await page.query_selector(".prd-brand a, .prd-brand, [class*='brand-name']")
        product["brand"] = (await brand_el.inner_text()).strip() if brand_el else None

        # Product images — class "image-index" inside ".img-main"
        imgs = await page.evaluate("""() => {
            return [...document.querySelectorAll('.img-main img.image-index')]
                .map(img => img.src)
                .filter(src => src.startsWith('http'));
        }""")
        product["images"] = list(dict.fromkeys(imgs))

        # Description — active tab inside .tab-wrap (avoids delivery address modal)
        desc_el = await page.query_selector(".tab-wrap .ui.bottom.attached.active.tab.segment")
        product["description"] = (await desc_el.inner_text()).strip()[:2000] if desc_el else None

        # Specs — non-active tabs inside .tab-wrap
        spec_tabs = await page.query_selector_all(".tab-wrap .ui.bottom.attached.tab.segment:not(.active)")
        spec_text = ""
        for tab in spec_tabs:
            text = (await tab.inner_text()).strip()
            if "แบรนด์" in text or "Brand" in text or len(text) > 50:
                spec_text = text[:1500]
                break
        product["specs"] = spec_text or None

        return product

    except PlaywrightTimeout:
        print(f"  [timeout] {url}")
        return None
    except Exception as e:
        print(f"  [error] {url}: {e}")
        return None


async def scrape_category(page: Page, category: dict) -> list[dict]:
    print(f"\n{'='*60}")
    print(f"Category: {category['name']}  ({category['url']})")

    print("  Collecting product URLs (infinite scroll)…")
    product_urls = await get_product_links(page, category["url"])
    print(f"  Found {len(product_urls)} products (using {min(PRODUCTS_PER_CATEGORY, len(product_urls))})")
    product_urls = product_urls[:PRODUCTS_PER_CATEGORY]

    products = []
    for url in tqdm(product_urls, desc=f"  {category['name']}", unit="product"):
        product = await scrape_product(page, url, category["name"])
        if product:
            products.append(product)
        await asyncio.sleep(DELAY_BETWEEN_PRODUCTS)

    return products


async def main():
    all_products = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="th-TH",
            viewport={"width": 1440, "height": 900},
        )
        page = await context.new_page()

        for category in EXTERIOR_CATEGORIES:
            products = await scrape_category(page, category)
            all_products.extend(products)

            out_file = DATA_DIR / f"{category['slug']}.json"
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(products, f, ensure_ascii=False, indent=2)
            print(f"  Saved {len(products)} products → {out_file.name}")

        await browser.close()

    combined_file = DATA_DIR / "homepro_exterior.json"
    with open(combined_file, "w", encoding="utf-8") as f:
        json.dump(all_products, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Total: {len(all_products)} products → {combined_file.name}")


if __name__ == "__main__":
    asyncio.run(main())
