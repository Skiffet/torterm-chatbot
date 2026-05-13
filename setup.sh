#!/bin/bash
# Setup script for HomePro scraper
set -e

echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing Python dependencies..."
pip install playwright pandas aiofiles tqdm

echo "Installing Playwright browsers..."
playwright install chromium

echo ""
echo "Setup complete! To run the scraper:"
echo "  source venv/bin/activate"
echo "  cd scraper"
echo "  python homepro_scraper.py"
