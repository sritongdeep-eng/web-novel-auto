#!/usr/bin/env python3
"""
Web Novel Auto Publisher — Zero-Cost Static Site Generator
Builds a mobile-friendly, dark-mode static site from Markdown chapters.
"""

import json
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE_DIR / "content"
SITE_DIR = BASE_DIR / "site"
OUTPUT_DIR = BASE_DIR / "dist"
SITE_URL = "https://sritongdeep-eng.github.io/web-novel-auto"

def read_markdown(filepath: Path) -> str:
    return filepath.read_text(encoding="utf-8")

def markdown_to_html(md_text: str) -> str:
    """Minimal Markdown → HTML converter (no dependencies)."""
    html = md_text

    # Headers
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)

    # Bold & Italic
    html = re.sub(r'\*\*\*(.*?)\*\*\*', r'<strong><em>\1</em></strong>', html)
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)

    # Horizontal rule
    html = re.sub(r'^---$', r'<hr>', html, flags=re.MULTILINE)

    # Blockquote
    html = re.sub(r'^&gt; (.*$)', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)

    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)

    # Paragraphs
    paragraphs = []
    in_paragraph = False
    for line in html.split('\n'):
        stripped = line.strip()
        if stripped.startswith('<') or stripped == '':
            if in_paragraph:
                paragraphs.append('</p>')
                in_paragraph = False
            if stripped.startswith('<'):
                paragraphs.append(stripped)
        else:
            if not in_paragraph:
                paragraphs.append('<p>')
                in_paragraph = True
            paragraphs.append(stripped)
    if in_paragraph:
        paragraphs.append('</p>')

    return '\n'.join(paragraphs)

def get_chapters() -> list:
    chapters = []
    chapter_dir = CONTENT_DIR / "chapters"
    if not chapter_dir.exists():
        return chapters

    for filepath in sorted(chapter_dir.glob("*.md")):
        content = read_markdown(filepath)
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else filepath.stem
        chapters.append({
            "id": filepath.stem.split("-")[0],
            "title": title,
            "file": filepath.name,
            "content": content
        })
    return chapters

def build_site():
    print("🔨 Building Web Novel Site...")

    # Clean output
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    # Copy static assets
    for folder in ["css", "js", "assets"]:
        src = SITE_DIR / folder
        dst = OUTPUT_DIR / folder
        if src.exists():
            shutil.copytree(src, dst)

    # Copy content
    shutil.copytree(CONTENT_DIR, OUTPUT_DIR / "content")

    # Read template
    template = (SITE_DIR / "templates" / "index.html").read_text(encoding="utf-8")

    # Build chapters
    chapters = get_chapters()
    if not chapters:
        print("⚠️  No chapters found!")
        return

    # Generate chapter list for JS
    chapter_list_js = "const chapters = [\n"
    for ch in chapters:
        chapter_list_js += f'  {{ id: {int(ch["id"])}, title: "{ch["title"]}", file: "{ch["file"]}" }},\n'
    chapter_list_js += "];\n"

    # Update main.js with chapter list
    main_js = (SITE_DIR / "js" / "main.js").read_text(encoding="utf-8")
    main_js = re.sub(r'const chapters = \[.*?\];', chapter_list_js, main_js, flags=re.DOTALL)
    (OUTPUT_DIR / "js" / "main.js").write_text(main_js, encoding="utf-8")

    # Inject marked.js CDN
    template = template.replace('</head>', '  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n</head>')

    # Write index.html
    (OUTPUT_DIR / "index.html").write_text(template, encoding="utf-8")

    # Generate individual chapter pages (optional, for SEO)
    chapters_dir = OUTPUT_DIR / "chapters"
    chapters_dir.mkdir(exist_ok=True)
    for idx, ch in enumerate(chapters):
        chapter_html = template.replace(
            '<article class="chapter-content" id="chapter-content">',
            f'<article class="chapter-content" id="chapter-content">\n{markdown_to_html(ch["content"])}'
        )

        # Remove static loading placeholder if present
        chapter_html = chapter_html.replace(
            '<div class="chapter-loading">Loading chapter...</div>\n',
            ''
        )

        # Ensure chapter stats container exists
        if '<div class="chapter-stats">' not in chapter_html:
            chapter_html = chapter_html.replace(
                '  </article>',
                '      <div class="chapter-stats">\n      <span id="reading-time"></span>\n      <span id="word-count"></span>\n    </div>\n  </article>'
            )

        # Set prev/next links based on chapter order
        prev_ch = chapters[idx - 1] if idx > 0 else None
        next_ch = chapters[idx + 1] if idx < len(chapters) - 1 else None

        prev_href = f'/chapters/{prev_ch["file"].replace(".md", ".html")}' if prev_ch else '/index.html'
        next_href = f'/chapters/{next_ch["file"].replace(".md", ".html")}' if next_ch else '/index.html'

        chapter_html = chapter_html.replace(
            '<a id="prev-chapter" class="nav-button nav-link" href="/index.html">← Previous</a>',
            f'<a id="prev-chapter" class="nav-button nav-link" href="{prev_href}">← Previous</a>'
        )
        chapter_html = chapter_html.replace(
            '<a id="next-chapter" class="nav-button nav-link" href="/index.html">Next →</a>',
            f'<a id="next-chapter" class="nav-button nav-link" href="{next_href}">Next →</a>'
        )

        # Ensure footer language selector exists
        if 'id="language-select"' not in chapter_html:
            chapter_html = chapter_html.replace(
                '<button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">🌙</button>',
                '<select id="language-select" class="language-select" aria-label="Language">\n          <option value="en">EN</option>\n          <option value="th">TH</option>\n          <option value="zh">ZH</option>\n          <option value="id">ID</option>\n          <option value="vi">VI</option>\n        </select>\n        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">🌙</button>'
            )

        # Ensure "To be continued" uses the correct next chapter when possible
        if next_ch:
            next_title = next_ch['title']
            next_file = next_ch['file'].replace('.md', '.html')
            chapter_html = chapter_html.replace(
                'To be continued in <a href="/chapters/02-the-crimson-circuit.html">Chapter 2: The Crimson Circuit</a>',
                f'To be continued in <a href="/chapters/{next_file}">{next_title}</a>'
            )
            chapter_html = chapter_html.replace(
                'To be continued in Chapter 46: The New Generation',
                f'To be continued in {next_title}'
            )

        (chapters_dir / f"{ch['file'].replace('.md', '.html')}").write_text(chapter_html, encoding="utf-8")

    # Copy built chapter pages to repo root `chapters/` so GitHub Pages serves fresh generated pages
    repo_chapters_dir = BASE_DIR / "chapters"
    repo_chapters_dir.mkdir(exist_ok=True)
    for built in sorted(chapters_dir.glob("*.html")):
        dst = repo_chapters_dir / built.name
        dst.write_bytes(built.read_bytes())

    print(f"✅ Built {len(chapters)} chapter(s)")
    print(f"📁 Output: {OUTPUT_DIR}")
    print(f"🌐 Open: {OUTPUT_DIR / 'index.html'}")

    # Generate RSS feed
    rss_path = OUTPUT_DIR / "rss.xml"
    rss_items = []
    for ch in chapters:
        chapter_url = f"https://sritongdeep-eng.github.io/web-novel-auto/chapters/{ch['file'].replace('.md', '.html')}"
        desc_match = re.search(r'^(?:\*\*)?(.*?)(?:\*\*)?$', ch['content'].split('\n')[1].strip())
        description = desc_match.group(1) if desc_match else ch['title']
        rss_items.append(f"""    <item>
      <title>{ch['title']}</title>
      <link>{chapter_url}</link>
      <description>{escape_xml(description)}</description>
      <pubDate>Tue, 19 Aug 2026 00:00:00 +0700</pubDate>
      <guid>{chapter_url}</guid>
    </item>""")

    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Veridian Protocol — Web Novel</title>
    <link>https://sritongdeep-eng.github.io/web-novel-auto/</link>
    <description>A Sci-Fi/Dark Fantasy series about blood-tech, AI consciousness, and humanity's fight for freedom.</description>
    <language>en</language>
    <lastBuildDate>Tue, 19 Aug 2026 00:00:00 +0700</lastBuildDate>
    <managingEditor>myhermes@example.com (MyHermes Studios)</managingEditor>
    <webMaster>myhermes@example.com (MyHermes Studios)</webMaster>
{os.linesep.join(rss_items)}
  </channel>
</rss>"""
    rss_path.write_text(rss_content, encoding="utf-8")
    print(f"📡 RSS generated: {rss_path}")

    # Generate sitemap
    sitemap_path = OUTPUT_DIR / "sitemap.xml"
    today = datetime.now().strftime("%Y-%m-%d")
    sitemap_items = [f'  <url>\n    <loc>{SITE_URL}/</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>']
    for ch in chapters:
        chapter_url = f"{SITE_URL}/chapters/{ch['file'].replace('.md', '.html')}"
        sitemap_items.append(f'  <url>\n    <loc>{chapter_url}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>')
    sitemap_content = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{os.linesep.join(sitemap_items)}\n</urlset>'
    sitemap_path.write_text(sitemap_content, encoding="utf-8")
    print(f"🗺️ Sitemap generated: {sitemap_path} ({len(sitemap_items)} URLs)")

    # Generate search index JSON
    search_index = []
    for ch in chapters:
        plain_text = re.sub(r'[#*_`]', '', ch['content'])
        plain_text = re.sub(r'\s+', ' ', plain_text).strip()
        search_index.append({
            "id": ch["id"],
            "title": ch["title"],
            "file": ch["file"],
            "url": f"/chapters/{ch['file'].replace('.md', '.html')}",
            "excerpt": plain_text[:300]
        })
    search_path = OUTPUT_DIR / "search.json"
    search_path.write_text(json.dumps(search_index, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"🔍 Search index generated: {search_path}")

def escape_xml(text: str) -> str:
    return text.replace("&", "&").replace("<", "<").replace(">", ">")

if __name__ == "__main__":
    build_site()
