# THE VERIDIAN PROTOCOL — Zero-Cost Autonomous Web Novel Pipeline

**Project:** Automated static web novel publishing system  
**Status:** ✅ Built & Tested  
**Cost:** $0 (Markdown + Python + GitHub Pages)

## Quick Start

```bash
# Build the site
python3 scripts/build.py

# Output is in dist/
# Open dist/index.html in browser
```

## Project Structure

```
D:\MyHermes\projects\web-novel-auto\
├── content/
│   ├── chapters/          # Markdown chapter files
│   │   └── 01-the-glitch-in-the-blood.md
│   ├── outline/           # Series outline & planning
│   │   └── README.md
│   └── assets/            # Images, cover art
├── site/
│   ├── templates/         # HTML template
│   │   └── index.html
│   ├── css/
│   │   └── style.css      # Dark mode, mobile-first
│   └── js/
│       └── main.js        # Chapter navigation + Markdown rendering
├── scripts/
│   └── build.py           # Static site generator
└── dist/                  # Built site (auto-generated)
```

## Features

- ✅ **Zero-cost**: Pure HTML/CSS/JS, no frameworks
- ✅ **Mobile-friendly**: Responsive design
- ✅ **Dark mode**: Crimson/dark theme matching novel aesthetic
- ✅ **Markdown-based**: Write chapters in .md files
- ✅ **Auto-build**: Python script compiles site instantly
- ✅ **GitHub Pages ready**: Deploy `dist/` folder

## Deployment

### Option 1: GitHub Pages (Free)
1. Create GitHub repo `web-novel-auto`
2. Push `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repo settings

### Option 2: Netlify/Vercel (Free)
1. Drag `dist/` folder to netlify.com/drop
2. Site goes live instantly

## Next Steps

- [ ] Write Chapter 2-10
- [ ] Add cover image generator
- [ ] Implement chapter navigation with prev/next
- [ ] Add reading progress indicator
- [ ] Deploy to GitHub Pages

## Tech Stack

- **Content**: Markdown
- **Build**: Python 3.11+
- **Frontend**: Vanilla HTML/CSS/JS
- **Deploy**: GitHub Pages / Netlify (free)

---

Built by MyHermes Studios Autonomous Pipeline  
2026-08-19
