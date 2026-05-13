"""Inspector: discover HomePro product listing API and correct selectors."""
import asyncio
import json
from playwright.async_api import async_playwright

CATEGORY_URL = "https://www.homepro.co.th/c/DOOR"


async def inspect():
    api_calls = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            locale="th-TH",
            viewport={"width": 1440, "height": 900},
        )
        page = await ctx.new_page()

        # Intercept XHR / fetch for product API
        async def on_response(response):
            url = response.url
            if any(k in url for k in ["product", "search", "listing", "category", "item", "api"]):
                try:
                    body = await response.json()
                    api_calls.append({"url": url, "body_keys": list(body.keys()) if isinstance(body, dict) else type(body).__name__})
                except Exception:
                    pass

        page.on("response", on_response)

        print(f"Loading: {CATEGORY_URL}")
        await page.goto(CATEGORY_URL, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        # Scroll down to trigger lazy load
        for _ in range(5):
            await page.evaluate("window.scrollBy(0, 800)")
            await page.wait_for_timeout(800)

        # Find all product links now
        links = await page.evaluate("""() => {
            return [...document.querySelectorAll('a')].map(a => a.href).filter(h => h.includes('/p/'));
        }""")
        print(f"\nProduct links after scroll: {len(links)}")
        for l in links[:10]:
            print(f"  {l}")

        # Show API calls captured
        print(f"\nAPI calls intercepted: {len(api_calls)}")
        for call in api_calls[:15]:
            print(f"  {call['url'][:100]}")
            print(f"    keys: {call['body_keys']}")

        # Find product card selectors
        card_info = await page.evaluate("""() => {
            const selectors = [
                '[class*="product-card"]', '[class*="ProductCard"]',
                '[class*="product-item"]', '[class*="ProductItem"]',
                '[class*="product-list"] li', '.product',
                '[data-testid*="product"]', 'article',
            ];
            for (const sel of selectors) {
                const els = document.querySelectorAll(sel);
                if (els.length > 0) return {selector: sel, count: els.length, sample: els[0].className};
            }
            return null;
        }""")
        print(f"\nProduct card selector: {card_info}")

        # Check current URL (may have redirected)
        print(f"\nFinal URL: {page.url}")

        # Screenshot for visual check
        await page.screenshot(path="/Users/thanuthamchonsongkram/torterm-chatbot/data/category_page.png")
        print("Screenshot saved to data/category_page.png")

        # --- Product page inspection ---
        if links:
            product_url = links[0]
            print(f"\n=== PRODUCT PAGE: {product_url} ===")
            await page.goto(product_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2500)

            # Name
            h1 = await page.query_selector("h1")
            print(f"Name: {(await h1.inner_text()).strip()[:80] if h1 else 'NOT FOUND'}")

            # Price - find specific elements
            price_info = await page.evaluate("""() => {
                return [...document.querySelectorAll('*')].filter(el => {
                    const cls = el.getAttribute('class') || '';
                    return cls.toLowerCase().includes('price');
                }).map(el => ({
                    class: el.getAttribute('class'),
                    text: el.innerText.trim().slice(0,80)
                })).filter(i => i.text).slice(0, 12);
            }""")
            print("\nPrice elements:")
            for p in price_info:
                print(f"  .{p['class']!r:55s} → {p['text']!r}")

            # Images
            imgs = await page.evaluate("""() => {
                return [...document.querySelectorAll('img')].filter(img => {
                    const src = img.src || '';
                    return src.startsWith('http') && !src.includes('icon') && !src.includes('logo') && img.width > 100;
                }).map(img => ({src: img.src.slice(0,100), w: img.width, h: img.height})).slice(0,6);
            }""")
            print("\nImages (>100px wide):")
            for img in imgs:
                print(f"  {img['w']}x{img['h']}  {img['src']}")

            # SKU
            sku_info = await page.evaluate("""() => {
                return [...document.querySelectorAll('*')].filter(el => {
                    const cls = el.getAttribute('class') || '';
                    const txt = el.innerText || '';
                    return (cls.toLowerCase().includes('sku') || txt.includes('SKU')) && el.children.length < 3 && txt.length < 50;
                }).map(el => ({class: el.getAttribute('class'), text: el.innerText.trim()})).slice(0,5);
            }""")
            print("\nSKU elements:")
            for s in sku_info:
                print(f"  .{str(s['class'])!r:40s} → {s['text']!r}")

            await page.screenshot(path="/Users/thanuthamchonsongkram/torterm-chatbot/data/product_page.png")
            print("\nProduct screenshot saved to data/product_page.png")

        await browser.close()


asyncio.run(inspect())
