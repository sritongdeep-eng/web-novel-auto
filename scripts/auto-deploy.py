#!/usr/bin/env python3
"""
Auto-Deploy Script with Retry & Error Recovery for Web Novel Pipeline.
- Auto-retry on rate limit / network timeout (max 5 attempts, 60s wait)
- Checkpoint system with state.json for resumption
"""

import json
import os
import shutil
import subprocess
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"
STATE_FILE = BASE_DIR / "scripts" / "state.json"
MAX_RETRIES = 5
RETRY_DELAY = 60

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"last_deploy": None, "retry_count": 0, "failed_chapters": []}

def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")

def retry_command(command: list, state: dict, context: str) -> bool:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=120,
                check=False
            )
            if result.returncode == 0:
                print(f"[OK] {context}")
                state["retry_count"] = 0
                save_state(state)
                return True

            stderr = result.stderr.lower()
            if "rate limit" in stderr or "timeout" in stderr or "network" in stderr:
                wait = RETRY_DELAY * attempt
                print(f"[WARN] {context} failed (attempt {attempt}/{MAX_RETRIES}): {result.stderr[:200]}")
                print(f"       Waiting {wait}s before retry...")
                state["retry_count"] = attempt
                save_state(state)
                time.sleep(wait)
            else:
                print(f"[ERROR] {context} failed (non-retryable): {result.stderr[:200]}")
                save_state(state)
                return False
        except subprocess.TimeoutExpired:
            wait = RETRY_DELAY * attempt
            print(f"[WARN] {context} timeout (attempt {attempt}/{MAX_RETRIES})")
            print(f"       Waiting {wait}s before retry...")
            state["retry_count"] = attempt
            save_state(state)
            time.sleep(wait)
        except Exception as e:
            wait = RETRY_DELAY * attempt
            print(f"[WARN] {context} exception (attempt {attempt}/{MAX_RETRIES}): {e}")
            state["retry_count"] = attempt
            save_state(state)
            time.sleep(wait)

    print(f"[FAIL] {context} failed after {MAX_RETRIES} attempts")
    state["failed_chapters"].append(context)
    save_state(state)
    return False

def build_site() -> bool:
    print("🔨 Building site...")
    return retry_command(
        ["python3", str(BASE_DIR / "scripts" / "build.py")],
        load_state(),
        "Build site"
    )

def deploy():
    state = load_state()
    print("🚀 Starting deployment with auto-retry...")
    print(f"   Max retries: {MAX_RETRIES}, Delay: {RETRY_DELAY}s")
    print(f"   Checkpoint: {STATE_FILE}")

    # Step 1: Build
    if not build_site():
        print("\n❌ Build failed. Resuming from checkpoint will retry build first.")
        return

    # Step 2: Create deploy package
    deploy_zip = BASE_DIR / "web-novel-deploy.zip"
    print(f"📦 Creating deploy package: {deploy_zip}")
    if deploy_zip.exists():
        deploy_zip.unlink()

    shutil.make_archive(str(deploy_zip).replace(".zip", ""), "zip", str(DIST_DIR))
    print(f"[OK] Package created: {deploy_zip} ({deploy_zip.stat().st_size // 1024}KB)")

    # Step 3: Attempt Netlify Drop
    print("\n📤 Deployment package ready!")
    print(f"   Drag this file to Netlify Drop:")
    print(f"   {deploy_zip}")
    print(f"\n   Or open: https://app.netlify.com/drop")

    # Step 4: Try GitHub push if gh is available
    try:
        subprocess.run(["gh", "--version"], check=True, capture_output=True)
        print("\n🐙 GitHub CLI detected. Attempting push...")
        os.chdir(BASE_DIR)

        commands = [
            ["git", "add", "."],
            ["git", "commit", "-m", f"Auto-deploy: {time.strftime('%Y-%m-%d %H:%M')}"],
            ["git", "push", "-u", "origin", "main"]
        ]

        for cmd in commands:
            if not retry_command(cmd, state, f"Git {' '.join(cmd[:2])}"):
                print(f"[WARN] Git command failed, but deploy package is ready")
                break
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("\n[INFO] GitHub CLI not available. Use Netlify Drop for deployment.")

    state["last_deploy"] = time.strftime("%Y-%m-%d %H:%M:%S")
    state["retry_count"] = 0
    save_state(state)
    print("\n✅ Deployment process complete!")
    print(f"   Checkpoint saved to: {STATE_FILE}")

if __name__ == "__main__":
    deploy()
