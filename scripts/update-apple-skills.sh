#!/bin/bash
set -euo pipefail

# update-apple-skills.sh — Sync configured external skills into this repo.
# Reads skills-manifest.json, clones/pulls repos, copies selected skills.
#
# Usage:
#   ./scripts/update-apple-skills.sh              # update all sources
#   ./scripts/update-apple-skills.sh --dry-run     # preview changes only
#   ./scripts/update-apple-skills.sh --source NAME # update single source
#   ./scripts/update-apple-skills.sh --list        # list all sources

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$ROOT_DIR/skills-manifest.json"
SKILLS_DIR="$ROOT_DIR/skills"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DRY_RUN=false
SOURCE_FILTER=""
LIST_ONLY=false

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --source)  SOURCE_FILTER="$2"; shift 2 ;;
    --list)    LIST_ONLY=true; shift ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--source NAME] [--list]"
      echo "  --dry-run     Preview changes without modifying files"
      echo "  --source NAME Update only the named source"
      echo "  --list        List all configured sources"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Check dependencies
if ! command -v jq &>/dev/null; then
  echo -e "${RED}Error: jq is required. Install with: brew install jq${NC}"
  exit 1
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo -e "${RED}Error: $MANIFEST not found${NC}"
  exit 1
fi

CACHE_DIR="$ROOT_DIR/$(jq -r '.cache_dir' "$MANIFEST")"
SOURCES_COUNT=$(jq '.sources | length' "$MANIFEST")

# List mode
if $LIST_ONLY; then
  echo -e "${BLUE}=== Configured Sources ===${NC}"
  for i in $(seq 0 $((SOURCES_COUNT - 1))); do
    name=$(jq -r ".sources[$i].name" "$MANIFEST")
    type=$(jq -r ".sources[$i].type" "$MANIFEST")
    count=$(jq ".sources[$i].skills | length" "$MANIFEST")
    if [[ "$type" == "git" ]]; then
      repo=$(jq -r ".sources[$i].repo" "$MANIFEST")
      echo -e "  ${GREEN}$name${NC} ($type, $count skills) -> $repo"
    else
      echo -e "  ${YELLOW}$name${NC} skipped: local sources are not supported"
    fi
  done
  exit 0
fi

echo -e "${BLUE}=== Skills Update ===${NC}"
$DRY_RUN && echo -e "${YELLOW}[DRY RUN] No files will be modified${NC}"
echo ""

mkdir -p "$CACHE_DIR"

UPDATED=0
SKIPPED=0
FAILED=0

for i in $(seq 0 $((SOURCES_COUNT - 1))); do
  name=$(jq -r ".sources[$i].name" "$MANIFEST")
  type=$(jq -r ".sources[$i].type" "$MANIFEST")
  skills_path=$(jq -r ".sources[$i].skills_path // \"skills\"" "$MANIFEST")
  skills_count=$(jq ".sources[$i].skills | length" "$MANIFEST")

  # Filter by source name
  if [[ -n "$SOURCE_FILTER" && "$name" != "$SOURCE_FILTER" ]]; then
    continue
  fi

  echo -e "${BLUE}[$name]${NC} ($type, $skills_count skills)"

  SOURCE_DIR=""

  if [[ "$type" != "git" ]]; then
    echo -e "  ${YELLOW}⚠ Skipping unsupported source type: $type${NC}"
    ((SKIPPED += skills_count))
    echo ""
    continue
  fi

  repo=$(jq -r ".sources[$i].repo" "$MANIFEST")
  branch=$(jq -r ".sources[$i].branch // \"main\"" "$MANIFEST")
  clone_dir="$CACHE_DIR/$name"

  if [[ -d "$clone_dir/.git" ]]; then
    echo -e "  Pulling latest..."
    if ! $DRY_RUN; then
      (cd "$clone_dir" && git fetch origin "$branch" --quiet && git reset --hard "origin/$branch" --quiet) 2>/dev/null || {
        echo -e "  ${RED}✗ Git pull failed${NC}"
        ((FAILED++))
        continue
      }
    fi
    echo -e "  ${GREEN}✓ Updated${NC}"
  else
    echo -e "  Cloning $repo..."
    if ! $DRY_RUN; then
      git clone --depth 1 --branch "$branch" --quiet "$repo" "$clone_dir" 2>/dev/null || {
        echo -e "  ${RED}✗ Git clone failed: $repo${NC}"
        ((FAILED++))
        continue
      }
    fi
    echo -e "  ${GREEN}✓ Cloned${NC}"
  fi

  SOURCE_DIR="$clone_dir"

  # Copy skills
  for j in $(seq 0 $((skills_count - 1))); do
    src=$(jq -r ".sources[$i].skills[$j].src" "$MANIFEST")
    dest=$(jq -r ".sources[$i].skills[$j].dest" "$MANIFEST")

    src_full="$SOURCE_DIR"
    if [[ "$skills_path" != "." ]]; then
      src_full="$SOURCE_DIR/$skills_path"
    fi
    src_full="$src_full/$src"

    dest_full="$SKILLS_DIR/$dest"

    if [[ ! -d "$src_full" ]]; then
      # Try without skills_path (some repos have skills at root)
      alt_src="$SOURCE_DIR/$src"
      if [[ -d "$alt_src" ]]; then
        src_full="$alt_src"
      else
        echo -e "  ${YELLOW}⚠ Skill not found: $src (tried $src_full and $alt_src)${NC}"
        ((SKIPPED++))
        continue
      fi
    fi

    # Verify SKILL.md exists
    if [[ ! -f "$src_full/SKILL.md" ]]; then
      echo -e "  ${YELLOW}⚠ No SKILL.md in $src_full${NC}"
      ((SKIPPED++))
      continue
    fi

    if $DRY_RUN; then
      echo -e "  ${YELLOW}-> Would copy: $src -> skills/$dest${NC}"
    else
      mkdir -p "$dest_full"
      rsync -a --delete --exclude='.git' --exclude='.DS_Store' --exclude='node_modules' \
        "$src_full/" "$dest_full/"
      echo -e "  ${GREEN}✓ $src -> skills/$dest${NC}"
    fi
    ((UPDATED++))
  done

  echo ""
done

echo -e "${BLUE}=== Summary ===${NC}"
echo -e "  Updated: ${GREEN}$UPDATED${NC}"
echo -e "  Skipped: ${YELLOW}$SKIPPED${NC}"
echo -e "  Failed:  ${RED}$FAILED${NC}"

if $DRY_RUN; then
  echo -e "\n${YELLOW}[DRY RUN] Re-run without --dry-run to apply changes${NC}"
fi
