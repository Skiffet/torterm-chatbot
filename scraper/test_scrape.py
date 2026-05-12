"""Smoke test: scrape 3 products from DOW category."""
import asyncio, json
from playwright.async_api import async_playwright
from homepro_scraper import get_product_links, scrape_product

TEST_URL = "https://www.homepro.co.th/c/DOW"

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            locale="th-TH", viewport={"width": 1440, "height": 900},
        )
        page = await ctx.new_page()

        print("Getting product links…")
        links = await get_product_links(page, TEST_URL)
        print(f"Total links: {len(links)}")

        results = []
        for url in links[1:4]:  # skip index 0 (usually a promo product), take next 3
            print(f"\nScraping: {url}")
            p = await scrape_product(page, url, "ประตูและหน้าต่าง")
            if p:
                results.append(p)
                print(f"  name:           {p['name']}")
                print(f"  price:          {p['price']}")
                print(f"  original_price: {p['original_price']}")
                print(f"  sku:            {p['sku']}")
                print(f"  brand:          {p['brand']}")
                print(f"  images:         {len(p['images'])} → {p['images'][:2]}")
                print(f"  description:    {str(p['description'])[:120]}")

        await browser.close()

    print(f"\n{'='*40}")
    print(f"Scraped {len(results)}/3 products successfully")

asyncio.run(main())
