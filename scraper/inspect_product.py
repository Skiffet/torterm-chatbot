"""Inspect a single product page for image and description selectors."""
import asyncio
from playwright.async_api import async_playwright

URL = "https://www.homepro.co.th/p/1290527"

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            locale="th-TH", viewport={"width": 1440, "height": 900},
        )
        page = await ctx.new_page()
        await page.goto(URL, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2500)

        # Images: find product image CDN
        imgs = await page.evaluate("""() => {
            return [...document.querySelectorAll('img')]
                .map(img => ({
                    src: img.src,
                    cls: img.getAttribute('class') || '',
                    parentCls: (img.parentElement?.getAttribute('class') || ''),
                    w: img.naturalWidth || img.width,
                    h: img.naturalHeight || img.height,
                }))
                .filter(i => i.src.startsWith('http'))
                .sort((a,b) => (b.w*b.h) - (a.w*a.h))
                .slice(0, 15);
        }""")
        print("=== IMAGES (sorted by size) ===")
        for img in imgs:
            print(f"  {img['w']}x{img['h']}  cls={img['cls']!r:25s}  parent={img['parentCls']!r:30s}")
            print(f"    {img['src'][:100]}")

        # Description: find all text blocks
        desc_info = await page.evaluate("""() => {
            return [...document.querySelectorAll('*')].filter(el => {
                const cls = el.getAttribute('class') || '';
                return cls.toLowerCase().includes('desc') || cls.toLowerCase().includes('detail') || cls.toLowerCase().includes('spec') || cls.toLowerCase().includes('tab');
            }).map(el => ({
                cls: cls = el.getAttribute('class'),
                tag: el.tagName,
                text: el.innerText.trim().slice(0, 120),
                childCount: el.children.length
            })).filter(i => i.text && i.text.length > 20).slice(0, 15);
        }""")
        print("\n=== DESCRIPTION/DETAIL elements ===")
        for d in desc_info:
            print(f"  <{d['tag']} class={d['cls']!r}> ({d['childCount']} children)")
            print(f"    {d['text']!r}")

        # Tabs / expandable sections
        tabs = await page.evaluate("""() => {
            return [...document.querySelectorAll('[class*="tab"], [class*="accordion"], [class*="collapse"]')]
                .map(el => ({cls: el.getAttribute('class'), text: el.innerText.trim().slice(0,80)}))
                .filter(i => i.text)
                .slice(0, 10);
        }""")
        print("\n=== TAB elements ===")
        for t in tabs:
            print(f"  .{t['cls']!r:50s}  {t['text']!r}")

    await browser.close()

asyncio.run(main())
