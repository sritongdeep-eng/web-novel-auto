#!/usr/bin/env python3
"""
Generate sitemap.xml for SEO.
"""

import os
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"
SITE_URL = "https://sritongdeep-eng.github.io/web-novel-auto"

def generate_sitemap():
    urls = [f"{SITE_URL}/"]
    
    chapters_dir = DIST_DIR / "chapters"
    if chapters_dir.exists():
        for html_file in sorted(chapters_dir.glob("*.html")):
            urls.append(f"{SITE_URL}/chapters/{html_file.name}")
    
    today = datetime.now().strftime("%Y-%m-%d")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{url}</loc>\n'
        sitemap += f'    <lastmod>{today}</lastmod>\n'
        sitemap += f'    <changefreq>weekly</changefreq>\n'
        sitemap += f'    <priority>{"1.0" if url.endswith("index.html") else "0.8"}</priority>\n'
        sitemap += f'  </url>\n'
    sitemap += '</urlset>'
    
    sitemap_path = DIST_DIR / "sitemap.xml"
    sitemap_path.write_text(sitemap, encoding="utf-8")
    print(f"✅ Sitemap generated: {sitemap_path} ({len(urls)} URLs)")

if __name__ == "__main__":
    generate_sitemap()
