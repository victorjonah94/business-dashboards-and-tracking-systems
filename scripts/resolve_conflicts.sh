#!/usr/bin/env bash
set -euo pipefail

# Auto-resolve common conflicts for this project.
# Default strategy: keep current feature-branch version (--ours).
# Usage:
#   ./scripts/resolve_conflicts.sh
#   ./scripts/resolve_conflicts.sh --theirs

STRATEGY="--ours"
if [[ "${1:-}" == "--theirs" ]]; then
  STRATEGY="--theirs"
fi

if [[ ! -f .git/MERGE_HEAD ]]; then
  echo "No merge in progress. Start with: git merge origin/main"
  exit 1
fi

FILES=(
  "README.md"
  "index.html"
  "script.js"
  "styles.css"
  "vercel.json"
  "DEPLOYMENT_FIX.md"
  "MERGE_CONFLICT_RESOLUTION.md"
)

echo "Resolving configured conflicts with strategy: ${STRATEGY}"
for f in "${FILES[@]}"; do
  if git ls-files --unmerged -- "$f" | grep -q .; then
    echo "- Resolving $f"
    git checkout "$STRATEGY" -- "$f"
    git add "$f"
  fi
done

if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Some conflicts remain in files outside configured list:"
  git diff --name-only --diff-filter=U
  echo "Resolve those manually, then run: git add <files> && git commit"
  exit 2
fi

git commit -m "Resolve merge conflicts using ${STRATEGY} strategy"
echo "Done. Push your branch now: git push"
