"""Find correct HomePro category URLs and product listing API."""
import asyncio
import json
from playwright.async_api import async_playwright

async def find_categories():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            locale="th-TH",
            viewport={"width": 1440, "height": 900},
        )
        page = await ctx.new_page()

        # --- 1. Collect nav links from homepage ---
        print("=== HOMEPAGE NAV ===")
        await page.goto("https://www.homepro.co.th", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        nav_links = await page.evaluate("""() => {
            return [...document.querySelectorAll('a')]
                .map(a => ({href: a.href, text: a.innerText.trim().slice(0, 40)}))
                .filter(a => a.href.includes('homepro.co.th') && a.text && a.href !== 'https://www.homepro.co.th/')
                .filter(a => a.href.includes('/c/') || a.href.includes('/search') || a.href.includes('/category'));
        }""")
        seen = set()
        print(f"Category-like links: {len(nav_links)}")
        for link in nav_links:
            if link['href'] not in seen:
                seen.add(link['href'])
                print(f"  {link['text']:40s} → {link['href']}")

        # Screenshot of homepage nav
        await page.screenshot(path="/Users/thanuthamchonsongkram/torterm-chatbot/data/homepage.png")

        # --- 2. Try hovering main menu to get dropdowns ---
        print("\n=== MENU HOVER ===")
        menu_items = await page.query_selector_all("nav > ul > li, [class*='menu'] > li, [class*='nav'] > ul > li")
        print(f"Top-level menu items: {len(menu_items)}")
        for item in menu_items[:6]:
            text = (await item.inner_text()).strip()[:50]
            print(f"  {text!r}")

        # --- 3. Try search with different formats ---
        print("\n=== SEARCH ATTEMPTS ===")
        api_calls = []

        async def on_response(response):
            url = response.url
            if "homepro.co.th" in url:
                ct = response.headers.get("content-type", "")
                if "json" in ct:
                    try:
                        body = await response.json()
                        api_calls.append({"url": url, "body": body})
                    except Exception:
                        pass

        page.on("response", on_response)

        search_urls = [
            "https://www.homepro.co.th/search?q=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B9",
            "https://www.homepro.co.th/search?text=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B9",
            "https://www.homepro.co.th/?q=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B9",
        ]
        for url in search_urls:
            api_calls.clear()
            await page.goto(url, wait_until="domcontentloaded", timeout=20000)
            await page.wait_for_timeout(2000)
            final_url = page.url
            links = await page.evaluate("""() => [...document.querySelectorAll('a')].map(a=>a.href).filter(h=>h.includes('/p/'))""")
            print(f"  {url[:70]}")
            print(f"    → redirect: {final_url[:80]}")
            print(f"    → product links: {len(links)}, API calls: {len(api_calls)}")
            if links:
                for l in links[:3]:
                    print(f"       {l}")

        # --- 4. Use the search box directly ---
        print("\n=== SEARCH VIA INPUT ===")
        api_calls.clear()
        await page.goto("https://www.homepro.co.th", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2000)

        search_input = await page.query_selector("input[type='search'], input[placeholder*='ค้นหา'], input[name*='search'], input[name*='keyword'], input[name*='q']")
        if search_input:
            await search_input.fill("ประตู")
            await page.keyboard.press("Enter")
            await page.wait_for_timeout(4000)
            print(f"  Searched, final URL: {page.url}")
            links = await page.evaluate("""() => [...document.querySelectorAll('a')].map(a=>a.href).filter(h=>h.includes('/p/'))""")
            print(f"  Product links: {len(links)}")
            for l in links[:5]:
                print(f"    {l}")
            await page.screenshot(path="/Users/thanuthamchonsongkram/torterm-chatbot/data/search_results.png")
            print(f"  Screenshot: data/search_results.png")

            print(f"\n  API calls: {len(api_calls)}")
            for call in api_calls:
                print(f"    {call['url'][:100]}")
                b = call['body']
                if isinstance(b, dict):
                    keys = list(b.keys())[:8]
                    print(f"      keys: {keys}")
                    for key in b:
                        val = b[key]
                        if isinstance(val, list) and len(val) > 0 and isinstance(val[0], dict):
                            print(f"      [{key}][0] keys: {list(val[0].keys())[:8]}")
        else:
            print("  No search input found")

        await browser.close()


asyncio.run(find_categories())
