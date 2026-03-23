#!/usr/bin/env python3
"""
Velocity Builders — Blog Batch Generator

Generates topic combinations from pillars × audiences × keywords,
registers them in the topic registry, and outputs a manifest for
sub-agent writing.

Usage:
    python3 generate-batch.py --pillar lead-generation --count 10
    python3 generate-batch.py --pillar hyper-local-seo --count 20 --audience agents
    python3 generate-batch.py --phase 1 --count 50  # All Phase 1 pillars
    python3 generate-batch.py --status  # Show current registry stats

Environment:
    PIPELINE_DIR: Override base directory (default: script directory)
"""

import argparse
import json
import os
import sys
from datetime import datetime, date

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_DIR = os.environ.get("PIPELINE_DIR", SCRIPT_DIR)
DATA_DIR = os.path.join(PIPELINE_DIR, "data")
TEMPLATES_DIR = os.path.join(PIPELINE_DIR, "templates")
QUEUE_DIR = os.path.join(PIPELINE_DIR, "queue")
MANIFESTS_DIR = os.path.join(PIPELINE_DIR, "manifests")


def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path) as f:
        return json.load(f)


def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def load_template(pillar_id):
    path = os.path.join(TEMPLATES_DIR, f"{pillar_id}.md")
    if os.path.exists(path):
        with open(path) as f:
            return f.read()
    return None


def get_next_id(registry):
    """Generate next post ID: post-YYYY-MMDD-NNN"""
    today = date.today().strftime("%Y-%m%d")
    existing = [e["id"] for e in registry.get("entries", []) if today in e["id"]]
    next_num = len(existing) + 1
    return f"post-{today}-{next_num:03d}"


def check_duplicate(registry, primary_keyword, pillar_id, city=None):
    """Check if a topic already exists in registry."""
    for entry in registry.get("entries", []):
        if entry.get("primaryKeyword", "").lower() == primary_keyword.lower():
            return True, f"Exact keyword match: {entry['id']}"
        if (entry.get("pillar") == pillar_id and
            entry.get("city") == city and
            entry.get("primaryKeyword", "").lower() in primary_keyword.lower()):
            return True, f"Similar topic in same pillar+city: {entry['id']}"
    return False, None


def generate_topics_from_keywords(pillar, keyword_gaps, count, audience_filter=None):
    """Generate topics from keyword gap data."""
    pillar_id = pillar["id"]
    audiences = pillar.get("audiences", [])
    if audience_filter:
        audiences = [a for a in audiences if a == audience_filter]

    # First try pillar-specific keywords (from keyword-gap-data.json by_pillar)
    all_keywords = []
    pillar_kws = keyword_gaps.get(pillar_id, [])

    if pillar_kws:
        for kw in pillar_kws:
            # Pillar-assigned keywords have different field names
            volume = kw.get("searchVolume", kw.get("volume", 0))
            kd = kw.get("keywordDifficulty", kw.get("kd", 100))
            score = kw.get("final_score", kw.get("opportunity_score", kw.get("score", 0)))
            kw_audiences = kw.get("audiences", [])

            # Map audience names
            audience_map = {
                "agents": "agents",
                "loan_officers": "loan-officers",
                "builders": "builders",
                "credit_unions": "credit-unions",
                "credit_unions_banks": "credit-unions",
            }

            # Pick best audience for this keyword
            audience = audiences[0] if audiences else "agents"
            for a in kw_audiences:
                mapped = audience_map.get(a, a)
                if not audience_filter or mapped == audience_filter:
                    audience = mapped
                    break

            all_keywords.append({
                "keyword": kw.get("keyword", ""),
                "volume": volume,
                "kd": kd,
                "score": score,
                "audience": audience,
            })

    # Sort by score, deduplicate
    seen = set()
    unique_kws = []
    for kw in sorted(all_keywords, key=lambda x: -x.get("score", 0)):
        if kw["keyword"].lower() not in seen:
            seen.add(kw["keyword"].lower())
            unique_kws.append(kw)

    topics = []
    for kw in unique_kws[:count]:
        topics.append({
            "primaryKeyword": kw["keyword"],
            "volume": kw["volume"],
            "kd": kw["kd"],
            "score": kw["score"],
            "audience": kw["audience"],
            "pillar": pillar_id,
            "city": None,
            "county": None,
            "state": None,
        })

    return topics


def generate_geo_topics(pillar, geography, count, audience_filter=None):
    """Generate geo-targeted topics for hyper-local-seo and market-intelligence."""
    topics = []
    audiences = pillar.get("audiences", [])
    if audience_filter:
        audiences = [a for a in audiences if a == audience_filter]

    strategies = [
        "Google Business Profile Optimization",
        "Neighborhood Page SEO Strategy",
        "Local Content Marketing Playbook",
        "Map Pack Ranking Strategy",
        "Hyperlocal Keyword Strategy",
        "IDX SEO Integration",
        "Local Link Building",
        "Review Generation Strategy",
    ]

    for region in geography.get("regions", []):
        state = region["state"]
        for city_data in region.get("cities", []):
            city = city_data["name"]
            county = city_data.get("county", "")
            priority = city_data.get("priority", "low")
            if priority in ("high", "medium"):
                for audience in audiences:
                    for strategy in strategies:
                        topics.append({
                            "primaryKeyword": f"{strategy.lower()} {city} {state}",
                            "volume": 0,  # Geo long-tail — volume varies
                            "kd": 0,
                            "score": 100 if priority == "high" else 50,
                            "audience": audience,
                            "pillar": pillar["id"],
                            "city": city,
                            "county": county,
                            "state": state,
                            "strategy": strategy,
                        })

    # Sort by score (priority), return requested count
    topics.sort(key=lambda x: -x["score"])
    return topics[:count]


def register_topics(registry, topics):
    """Register new topics in the registry, skip duplicates."""
    registered = []
    skipped = []
    now = datetime.utcnow().isoformat() + "Z"

    for topic in topics:
        is_dup, reason = check_duplicate(
            registry, topic["primaryKeyword"], topic["pillar"], topic.get("city")
        )
        if is_dup:
            skipped.append({"topic": topic["primaryKeyword"], "reason": reason})
            continue

        post_id = get_next_id(registry)
        # Build title from template pattern
        audience_label = topic["audience"].replace("-", " ").title()
        city_suffix = f" in {topic.get('city', '')}, {topic.get('state', '')}" if topic.get("city") else ""
        year = datetime.now().year

        if topic.get("strategy"):
            title = f"{topic['strategy']} for {audience_label}{city_suffix} — {year}"
        else:
            kw = topic["primaryKeyword"].title()
            title = f"{kw}: What {audience_label} Need to Know in {year}"

        slug = title.lower().replace(" ", "-").replace(":", "").replace("—", "").replace("'", "")[:80]

        entry = {
            "id": post_id,
            "title": title,
            "slug": slug,
            "pillar": topic["pillar"],
            "audiences": [topic["audience"]],
            "primaryKeyword": topic["primaryKeyword"],
            "secondaryKeywords": [],
            "city": topic.get("city"),
            "county": topic.get("county"),
            "state": topic.get("state"),
            "angle": topic.get("strategy", f"Keyword gap opportunity: {topic['primaryKeyword']}"),
            "publishDate": None,
            "status": "registered",
            "similarityScore": None,
            "similarTo": None,
            "flagged": False,
            "flagReason": None,
            "createdAt": now,
            "updatedAt": now,
        }

        registry.setdefault("entries", []).append(entry)
        registered.append(entry)

    return registered, skipped


def write_manifest(registered, pillar_id):
    """Write a manifest file for sub-agent spawning."""
    os.makedirs(MANIFESTS_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    manifest_path = os.path.join(MANIFESTS_DIR, f"manifest-{pillar_id}-{timestamp}.json")

    manifest = {
        "created": datetime.utcnow().isoformat() + "Z",
        "pillar": pillar_id,
        "count": len(registered),
        "posts": [
            {
                "id": e["id"],
                "title": e["title"],
                "primaryKeyword": e["primaryKeyword"],
                "audiences": e["audiences"],
                "city": e.get("city"),
                "state": e.get("state"),
                "county": e.get("county"),
            }
            for e in registered
        ],
    }

    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    return manifest_path


def show_status(registry, pillars):
    """Show current registry stats."""
    entries = registry.get("entries", [])
    print(f"\n📊 Topic Registry Status")
    print(f"   Total entries: {len(entries)}")
    print()

    by_status = {}
    by_pillar = {}
    for e in entries:
        s = e.get("status", "unknown")
        p = e.get("pillar", "unknown")
        by_status[s] = by_status.get(s, 0) + 1
        by_pillar[p] = by_pillar.get(p, 0) + 1

    print("   By status:")
    for k, v in sorted(by_status.items()):
        print(f"     {k}: {v}")

    print("\n   By pillar:")
    pillar_map = {p["id"]: p for p in pillars.get("pillars", [])}
    for k, v in sorted(by_pillar.items(), key=lambda x: -x[1]):
        name = pillar_map.get(k, {}).get("name", k)
        target_per_day = pillar_map.get(k, {}).get("postsPerDay", "?")
        print(f"     {name}: {v} (target: {target_per_day}/day)")

    # Coverage gaps
    print("\n   ⚠️  Pillars with zero entries:")
    for p in pillars.get("pillars", []):
        if p["id"] not in by_pillar:
            print(f"     {p['name']} (Phase {p['phase']}, {p['postsPerDay']}/day)")


def main():
    parser = argparse.ArgumentParser(description="Velocity Builders Blog Batch Generator")
    parser.add_argument("--pillar", help="Pillar ID to generate for")
    parser.add_argument("--phase", type=int, help="Generate for all pillars in this phase")
    parser.add_argument("--count", type=int, default=10, help="Number of topics to generate")
    parser.add_argument("--audience", help="Filter by audience")
    parser.add_argument("--status", action="store_true", help="Show registry status")
    parser.add_argument("--dry-run", action="store_true", help="Preview without registering")

    args = parser.parse_args()

    pillars = load_json("pillars.json")
    registry = load_json("topic-registry.json")
    geography = load_json("geography.json")

    if args.status:
        show_status(registry, pillars)
        return

    # Load keyword gap data — prefer the pillar-assigned SEO data
    keyword_gaps = {}
    seo_dir = os.path.join(os.path.dirname(PIPELINE_DIR), "seo") if os.path.exists(os.path.join(os.path.dirname(PIPELINE_DIR), "seo")) else None
    pillar_gap_path = os.path.join(seo_dir, "keyword-gap-data.json") if seo_dir else None

    if pillar_gap_path and os.path.exists(pillar_gap_path):
        with open(pillar_gap_path) as f:
            pillar_gap_data = json.load(f)

        # Map gap data pillar names to pillars.json IDs by name matching
        name_to_id = {}
        for p in pillars.get("pillars", []):
            name_to_id[p.get("name", "").lower().strip()] = p["id"]

        for num_str, pillar_data in pillar_gap_data.get("by_pillar", {}).items():
            gap_name = pillar_data.get("pillar_name", "").lower().strip()
            # Try exact match first
            pid = name_to_id.get(gap_name)
            if not pid:
                # Try partial match
                for name, id_ in name_to_id.items():
                    if gap_name.startswith(name[:15]) or name.startswith(gap_name[:15]):
                        pid = id_
                        break
            if pid:
                kws = pillar_data.get("top_keywords", [])
                keyword_gaps[pid] = kws
    else:
        # Fallback: load audience-based gap files
        for gap_file in ["keyword-gap-realtors.json", "keyword-gap-loan_officers.json",
                         "keyword-gap-builders.json", "keyword-gap-credit_unions_banks.json"]:
            gap_path = os.path.join(DATA_DIR, gap_file)
            if os.path.exists(gap_path):
                key = gap_file.replace("keyword-gap-", "").replace(".json", "")
                with open(gap_path) as f:
                    data = json.load(f)
                    if isinstance(data, dict) and "keywords" in data:
                        keyword_gaps[key] = data["keywords"]
                    elif isinstance(data, list):
                        keyword_gaps[key] = data
                    else:
                        keyword_gaps[key] = []

    # Determine which pillars to generate for
    target_pillars = []
    if args.pillar:
        for p in pillars.get("pillars", []):
            if p["id"] == args.pillar:
                target_pillars.append(p)
                break
        if not target_pillars:
            print(f"❌ Pillar '{args.pillar}' not found")
            sys.exit(1)
    elif args.phase:
        target_pillars = [p for p in pillars.get("pillars", []) if p.get("phase") == args.phase]
    else:
        print("❌ Specify --pillar, --phase, or --status")
        sys.exit(1)

    # Generate topics
    all_registered = []
    all_skipped = []

    for pillar in target_pillars:
        per_pillar_count = args.count if args.pillar else max(5, args.count // len(target_pillars))
        print(f"\n🔧 Generating {per_pillar_count} topics for {pillar['name']}...")

        if pillar["id"] in ("hyper-local-seo", "market-intelligence"):
            topics = generate_geo_topics(pillar, geography, per_pillar_count, args.audience)
        else:
            topics = generate_topics_from_keywords(pillar, keyword_gaps, per_pillar_count, args.audience)

        if args.dry_run:
            print(f"   [DRY RUN] Would register {len(topics)} topics:")
            for t in topics[:5]:
                print(f"     - {t['primaryKeyword']} ({t['audience']})")
            if len(topics) > 5:
                print(f"     ... and {len(topics)-5} more")
            continue

        registered, skipped = register_topics(registry, topics)
        all_registered.extend(registered)
        all_skipped.extend(skipped)

        if registered:
            manifest_path = write_manifest(registered, pillar["id"])
            print(f"   ✅ Registered {len(registered)} topics")
            print(f"   📋 Manifest: {manifest_path}")
        if skipped:
            print(f"   ⏭️  Skipped {len(skipped)} duplicates")

    if not args.dry_run and all_registered:
        save_json("topic-registry.json", registry)
        print(f"\n✅ Total registered: {len(all_registered)}")
        print(f"⏭️  Total skipped: {len(all_skipped)}")
        print(f"📝 Registry saved to {os.path.join(DATA_DIR, 'topic-registry.json')}")


if __name__ == "__main__":
    main()
