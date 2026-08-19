#!/usr/bin/env python3
"""
Cover Image Generator for The Veridian Protocol.
Generates a dark crimson-themed cover image using SVG.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = BASE_DIR / "content" / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a0a0f;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Crimson circuit lines -->
  <path d="M 100 500 L 300 400 L 500 450 L 700 350 L 900 400 L 1100 300" 
        stroke="#c41e3a" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M 200 550 L 400 500 L 600 520 L 800 450 L 1000 480" 
        stroke="#c41e3a" stroke-width="1.5" fill="none" opacity="0.4"/>
  
  <!-- Central tree-circuit symbol -->
  <circle cx="600" cy="280" r="120" fill="none" stroke="#c41e3a" stroke-width="3" filter="url(#glow)"/>
  <circle cx="600" cy="280" r="80" fill="none" stroke="#e63950" stroke-width="2" opacity="0.8"/>
  <circle cx="600" cy="280" r="40" fill="#c41e3a" opacity="0.3"/>
  
  <!-- Circuit branches -->
  <line x1="600" y1="160" x2="600" y2="100" stroke="#c41e3a" stroke-width="2"/>
  <line x1="600" y1="400" x2="600" y2="460" stroke="#c41e3a" stroke-width="2"/>
  <line x1="480" y1="280" x2="420" y2="280" stroke="#c41e3a" stroke-width="2"/>
  <line x1="720" y1="280" x2="780" y2="280" stroke="#c41e3a" stroke-width="2"/>
  
  <!-- Title -->
  <text x="600" y="520" font-family="Georgia, serif" font-size="56" font-weight="bold" 
        fill="#c41e3a" text-anchor="middle" filter="url(#glow)">THE VERIDIAN PROTOCOL</text>
  
  <!-- Subtitle -->
  <text x="600" y="570" font-family="Georgia, serif" font-size="24" 
        fill="#b0b0b8" text-anchor="middle">A Sci-Fi / Dark Fantasy Series</text>
  
  <!-- Author -->
  <text x="600" y="610" font-family="Georgia, serif" font-size="16" 
        fill="#888" text-anchor="middle">MyHermes Studios — 2026</text>
</svg>'''

(ASSETS_DIR / "cover.svg").write_text(svg_content, encoding="utf-8")
print(f"✅ Cover image generated: {ASSETS_DIR / 'cover.svg'}")
