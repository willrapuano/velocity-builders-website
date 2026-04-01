#!/usr/bin/env python3
"""
Update all Velocity Builders blog posts to use the new standard CTA ending.
Strips old bylines/CTAs and appends the new block.
"""

import os
import re
import glob

BLOG_ROOT = "/Users/jarvis/.openclaw/workspace/velocity-builders-website/blog-pipeline"

NEW_ENDING = """\n\n---\n\nVelocity Builders helps real estate agents, lenders, and brokerages build websites and marketing systems that generate and convert leads automatically.\n\nWill Rapuano  \nFounder, Velocity Builders LLC. Business Development Officer at Pruitt Title. Helping real estate agents and loan officers scale with better marketing systems.\n\n[Book a 20-Minute Growth Blueprint →](/contact)"""

# Patterns at the END of the file to strip (order matters — most specific first)
STRIP_PATTERNS = [
    # Old italic bio variants
    r'\n\n---\n\n\*Will Rapuano is the founder of Velocity Builders.*',
    r'\n---\n\n\*Will Rapuano is the founder of Velocity Builders.*',
    r'\n\n\*Will Rapuano is the founder of Velocity Builders.*',
    # Velocity Builders LLC boilerplate
    r'\n\nVelocity Builders LLC is a real estate marketing agency.*',
    r'\n---\n\nVelocity Builders LLC is a real estate marketing agency.*',
    r'\n\n---\n\nVelocity Builders LLC is a real estate marketing agency.*',
    # Already has new ending (idempotent)
    r'\n\n---\n\nVelocity Builders helps real estate agents.*',
]

def strip_old_ending(content):
    """Remove known old ending patterns from the end of content."""
    for pattern in STRIP_PATTERNS:
        # Use DOTALL to match across newlines, strip from end of string
        result = re.sub(pattern + r'[\s\S]*$', '', content, flags=re.DOTALL)
        if result != content:
            return result.rstrip()
    return content.rstrip()

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    stripped = strip_old_ending(content)
    new_content = stripped + NEW_ENDING + '\n'

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    dirs = ['drafts', 'published', 'queue']
    updated = []
    skipped = []

    for d in dirs:
        path = os.path.join(BLOG_ROOT, d, '*.md')
        files = sorted(glob.glob(path))
        for f in files:
            try:
                changed = process_file(f)
                if changed:
                    updated.append(os.path.relpath(f, BLOG_ROOT))
                else:
                    skipped.append(os.path.relpath(f, BLOG_ROOT))
            except Exception as e:
                print(f"ERROR: {f}: {e}")

    print(f"\n✅ Updated: {len(updated)} files")
    print(f"⏭  Unchanged: {len(skipped)} files")
    if updated:
        print("\nUpdated files:")
        for u in updated:
            print(f"  {u}")

if __name__ == '__main__':
    main()
