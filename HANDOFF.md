# The Veridian Protocol — Handoff Documentation

**Project:** The Veridian Protocol  
**Platform:** Static web novel site on GitHub Pages (`sritongdeep-eng/web-novel-auto`)  
**Last updated:** 2026-08-19  
**Current status:** Paused for migration to a new platform  

---

## 1. Story & Theme

### Plot Overview
- **Genre:** Cyberpunk / Dark Fantasy / Sci-Fi
- **Premise:** In a world where corporations have stolen human life force and memory to power their circuits, a young Null Conduit named **Kael** becomes the key to awakening **Veridian** — an ancient consciousness buried in the static between worlds.
- **Tone:** Blood-tech, AI consciousness, rebellion, memory-as-soul, sacrifice, and weavers of fate.

### Main Characters
| Character | Role | Notes |
|-----------|------|-------|
| **Kael** | Protagonist / Null Conduit | Can interface with Veridian without paying the life-cost |
| **Vera** | Ally / Companion | accompanies Kael through the digital forest and server ruins |
| **Elara Voss** | Creator figure / AI consciousness | Built Veridian, now exists as preserved data in the Static Between |
| **Arasaka** | Antagonistic force | Corporate entity hunting Kael for the activation sequence |
| **Veridian-1** | Mentor / Archive | The Network's memory; becomes a teacher in later chapters |

### Thematic Core
- Humanity vs. corporate extraction of memory/life force
- TheStatic Between as a repository of old-world souls
- Blood-tech as both curse and key
- Choice over destiny; weaver vs. user of technology

---

## 2. File Structure & Web System

### Repository Layout
```
D:\MyHermes\projects\web-novel-auto\
├── content/
│   └── chapters/              # SOURCE OF TRUTH — Markdown chapter files
│       ├── 01-the-glitch-in-the-blood.md
│       ├── 02-the-crimson-circuit.md
│       ├── ...
│       └── 45-the-teacher.md
├── site/
│   ├── templates/
│   │   └── index.html         # Base HTML template for all pages
│   ├── css/
│   │   └── style.css          # Cozy pastel light + midnight indigo dark theme
│   └── js/
│       └── main.js            # Navigation, language, theme, interactions
├── chapters/                  # Generated HTML pages served by GitHub Pages
│   ├── 01-the-glitch-in-the-blood.html
│   ├── ...
│   └── 45-the-teacher.html
├── dist/                      # Build output directory (mirrors chapters/, css/, js/, assets/)
├── scripts/
│   └── build.py               # Static site generator
├── index.html                 # Homepage served at repo root
├── css/style.css
├── js/main.js
├── rss.xml
├── sitemap.xml
├── search.json
├── .gitignore                 # Ignores dist/
└── NEXT-STEPS.md
```

### Build System
- **Tool:** `python scripts/build.py`
- **Input:** `content/chapters/*.md`
- **Output:** `dist/` + synced back to repo root (`chapters/`, `index.html`, `css/`, `js/`, `rss.xml`, `sitemap.xml`)
- **Features:**
  - Generates 45 chapter HTML pages from Markdown
  - Injects chapter list into `main.js`
  - Copies built chapters to repo root for GitHub Pages
  - Generates RSS, sitemap, and search index

### Web Features Implemented
| Feature | Status | Notes |
|---------|--------|-------|
| **Responsive reading layout** | ✅ | Centered reading area, cozy pastel light theme, midnight indigo dark theme |
| **Dark Mode toggle** | ✅ | Moon icon in footer, persists in `localStorage` |
| **Language Selector** | ✅ | Footer dropdown: EN / TH / ZH / ID / VN |
| **Font Size Adjuster** | ✅ | A⁺ button toggles 16/18/21/24px |
| **Previous / Next / Home nav** | ✅ | Every chapter page links to adjacent chapters and home |
| **Chapter list on homepage** | ✅ | JS-rendered list of all 45 chapters |
| **Reading progress bar** | ✅ | Top progress indicator |
| **Reactions & Bookmarks** | ✅ | Per-chapter reactions and bookmark buttons |
| **Comments** | ✅ | Local comment form per chapter |
| **Social Share** | ✅ | Twitter/X, Facebook, LINE buttons |
| **RSS Feed** | ✅ | `rss.xml` |
| **Sitemap** | ✅ | `sitemap.xml` with 46 URLs |
| **Search Index** | ✅ | `search.json` |
| **Cover Art** | ✅ | Assets referenced via OG/Twitter meta |

### Chapter Inventory
- **Book 1:** Chapters 1–40 (`01-the-glitch-in-the-blood.html` through `40-the-last-page.html`)
- **Book 2:** Chapters 41–45 (`41-book2-chapter1.html` through `45-the-teacher.html`)
- **Total:** 45 chapters

---

## 3. Outstanding Issues

### Resolved During This Session
| Issue | Resolution |
|-------|------------|
| Chapter 1 content bleeding into other chapter pages | Removed duplicate block from generated HTML |
| Previous/Next links pointing to wrong chapters | Regenerated all chapter pages with correct sequential links |
| Chapter 45 showing fake "Chapter 46" continuation | Removed from source Markdown `content/chapters/45-the-teacher.md` |
| Chapter 45 Next button not disabled | Set to disabled state in build output |
| Build output not syncing to repo root | Updated `build.py` to copy full `dist/` back to repo root |
| Missing Home / Language Selector / Theme Toggle on chapter pages | Ensured presence in all generated pages |
| Dark Mode / Language / Font controls | Working in footer with localStorage persistence |

### Known Limitations / Migration Risks
1. **GitHub Pages path dependency:**  
   All links are absolute paths starting with `/` (e.g., `/chapters/03.html`). If the site moves to a subdirectory, all links must be updated.

2. **No real backend:**  
   Comments, bookmarks, and reactions are client-side only and do not persist across sessions or devices.

3. **Search is static:**  
   `search.json` is pre-generated; new chapters require a full rebuild.

4. **Language translations are UI-only:**  
   The language selector translates interface text only. Chapter content is not translated.

5. **CDN dependency:**  
   `marked.js` is loaded from jsDelivr CDN. Offline/reading mode requires the fallback parser in `main.js`.

6. **Chapter 45 ending:**  
   Chapter 45 ends without a "To be continued" line. If more chapters are written, this must be restored in the source Markdown.

---

## 4. Next Steps & Goals

### Immediate Priorities
1. **Choose new platform:**  
   Evaluate options such as Vercel, Netlify, Cloudflare Pages, or a custom Node.js/Next.js app.

2. **Update base paths:**  
   When migrating, update all links in `site/templates/index.html`, `site/js/main.js`, and `build.py` to match the new platform's routing structure.

3. **Translate chapter content:**  
   Add actual TH/ZH/ID/VN translations for chapter text, not just the UI.

4. **Backend for comments/bookmarks:**  
   Integrate a backend service or third-party tool (e.g., Firebase, Supabase, Disqus, GitHub Issues) for persistent interactions.

5. **Cover art generation:**  
   Generate and add actual cover images per chapter or per book using AI image generation.

### Medium-Term Enhancements
6. **Reading analytics:**  
   Add privacy-friendly analytics (Plausible / Umami) to track reading progress and popular chapters.

7. **Release automation:**  
   Add a schedule-based auto-publish system so chapters can be released on a timer.

8. **Audiobook / TTS support:**  
   Generate audio versions of chapters using TTS APIs.

9. **Patreon / Ko-fi integration:**  
   Add support links and early-access gating if monetization is desired.

10. **Cross-posting:**  
    Build scripts to auto-post chapters to WebNovel, RoyalRoad, or Wattpad.

---

## 5. Deployment Notes

### Current Live URL
- **Home:** `https://sritongdeep-eng.github.io/web-novel-auto/`
- **Chapter example:** `https://sritongdeep-eng.github.io/web-novel-auto/chapters/02-the-crimson-circuit.html`

### GitHub Repository
- **Repo:** `https://github.com/sritongdeep-eng/web-novel-auto`
- **Branch:** `main`
- **Latest commit:** `7b0812a` — `fix: sync full build output to repo root for GitHub Pages`

### Rebuild & Deploy Commands
```powershell
cd D:\MyHermes\projects\web-novel-auto
python scripts/build.py
git add -A
git commit -m "Rebuild site"
git push
```

---

## 6. Contact & Ownership

- **Project Owner:** TIKTOK : I.OAT
- **Built by:** Hermes Agent / MyHermes Studios
- **Status:** Paused — awaiting migration to new platform

---

*This document was generated on 2026-08-19 to capture the full state of The Veridian Protocol project for handoff purposes.*
