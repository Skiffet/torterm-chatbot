"""Quick test: load DOW category and find product links + pagination."""
import asyncio
from playwright.async_api import async_playwright

TEST_URL = "https://www.homepro.co.th/c/DOW"


async def test():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            locale="th-TH",
            viewport={"width": 1440, "height": 900},
        )
        page = await ctx.new_page()

        print(f"Loading {TEST_URL}…")
        await page.goto(TEST_URL, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(4000)

        # Scroll a few times
        for i in range(8):
            await page.evaluate("window.scrollBy(0, 800)")
            await page.wait_for_timeout(600)

        links = await page.evaluate("""() =>
            [...new Set([...document.querySelectorAll('a')].map(a=>a.href).filter(h=>h.includes('/p/')))]
        """)
        print(f"Product links after scroll: {len(links)}")
        for l in links[:10]:
            print(f"  {l}")

        # Pagination
        pag = await page.evaluate("""() => {
            return [...document.querySelectorAll('a,button')]
                .filter(el => {
                    const cls = (el.getAttribute('class')||'').toLowerCase();
                    const aria = (el.getAttribute('aria-label')||'').toLowerCase();
                    const txt = (el.innerText||'').trim();
                    return cls.includes('page') || aria.includes('page') || aria.includes('next') || txt === '>';
                })
                .map(el => ({tag: el.tagName, cls: el.getAttribute('class'), href: el.href, text: el.innerText.trim(), aria: el.getAttribute('aria-label')}))
        }""")
        print(f"\nPagination elements: {len(pag)}")
        for p in pag[:8]:
            print(f"  {p}")

        # Product card check
        card_count = await page.evaluate("""() => {
            const tests = [
                '[class*="product-card"]','[class*="ProductCard"]','[class*="product-item"]',
                '[class*="prd-"]','[class*="item-card"]','[data-product]','.item','article'
            ];
            for (const s of tests) {
                const n = document.querySelectorAll(s).length;
                if (n > 2) return {selector: s, count: n};
            }
            return null;
        }""")
        print(f"\nProduct card selector: {card_count}")

        await page.screenshot(path="/Users/thanuthamchonsongkram/torterm-chatbot/data/dow_category.png")
        print("Screenshot: data/dow_category.png")

        await browser.close()


asyncio.run(test())
