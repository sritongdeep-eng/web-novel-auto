#!/usr/bin/env python3
"""
Local preview server for the web novel site.
Opens dist/index.html in browser with a simple HTTP server.
"""

import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8080
DIST_DIR = Path(__file__).resolve().parent.parent / "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

if __name__ == "__main__":
    print(f"🌐 Starting local server at http://localhost:{PORT}")
    print(f"📁 Serving from: {DIST_DIR}")
    print("Press Ctrl+C to stop\n")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
