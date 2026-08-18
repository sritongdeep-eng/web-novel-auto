#!/usr/bin/env python3
"""
Deploy Web Novel Site to GitHub Pages or Netlify (zero-cost hosting).
"""

import os
import shutil
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"

def deploy_github_pages():
    """Deploy to GitHub Pages via gh-pages branch."""
    print("🚀 Deploying to GitHub Pages...")

    # Check if git is available
    try:
        subprocess.run(["git", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Git not found. Install Git first.")
        return False

    # Create a temporary deploy directory
    deploy_dir = BASE_DIR / "deploy-temp"
    if deploy_dir.exists():
        shutil.rmtree(deploy_dir)
    deploy_dir.mkdir()

    # Copy dist contents
    for item in DIST_DIR.iterdir():
        if item.is_dir():
            shutil.copytree(item, deploy_dir / item.name)
        else:
            shutil.copy2(item, deploy_dir / item.name)

    # Initialize git repo for deployment
    os.chdir(deploy_dir)
    subprocess.run(["git", "init"], check=True, capture_output=True)
    subprocess.run(["git", "add", "."], check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "Deploy web novel site"], check=True, capture_output=True)

    # Instructions for manual push
    print("\n✅ Deployment files ready in:", deploy_dir)
    print("\nTo deploy to GitHub Pages:")
    print("  1. Create a new repo on GitHub (e.g., 'web-novel-auto')")
    print("  2. Run these commands:")
    print(f"     cd {deploy_dir}")
    print("     git remote add origin https://github.com/YOUR_USERNAME/web-novel-auto.git")
    print("     git branch -M gh-pages")
    print("     git push -u origin gh-pages")
    print("  3. Enable GitHub Pages in repo settings (source: gh-pages branch)")
    print("\nOr use Netlify Drop:")
    print("  1. Go to https://app.netlify.com/drop")
    print("  2. Drag the 'deploy-temp' folder into the page")
    print("  3. Your site is live instantly!")

    return True

def deploy_netlify():
    """Deploy to Netlify via CLI if available."""
    print("🚀 Deploying to Netlify...")

    try:
        subprocess.run(["netlify", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Netlify CLI not found. Install with: npm install -g netlify-cli")
        print("Falling back to manual deploy instructions...")
        return deploy_github_pages()

    # Deploy via Netlify CLI
    result = subprocess.run(
        ["netlify", "deploy", "--dir", str(DIST_DIR), "--prod"],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print("✅ Deployed to Netlify successfully!")
        print(result.stdout)
        return True
    else:
        print("❌ Netlify deploy failed:")
        print(result.stderr)
        return False

if __name__ == "__main__":
    import sys

    print("🌐 Web Novel Auto Publisher — Deployment")
    print("=" * 50)

    # Try Netlify first, fallback to GitHub Pages instructions
    if not deploy_netlify():
        print("\n" + "=" * 50)
        deploy_github_pages()
