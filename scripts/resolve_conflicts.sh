#!/usr/bin/env bash
set -euo pipefail

# Auto-resolve common conflicts for this project by keeping feature-branch UI changes.
# Run only when a merge is in progress.

if [[ ! -f .git/MERGE_HEAD ]]; then
  echo "No merge in progress. Start with: git merge origin/main"
  exit 1
fi

FILES=(
  "index.html"
  "styles.css"
  "script.js"
  "vercel.json"
  "README.md"
  "DEPLOYMENT_FIX.md"
  "MERGE_CONFLICT_RESOLUTION.md"
)

for f in "${FILES[@]}"; do
  if git ls-files --unmerged -- "$f" | grep -q .; then
    echo "Resolving $f by keeping current branch version (--ours)"
    git checkout --ours -- "$f"
    git add "$f"
  fi
done

if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Some conflicts remain in other files. Resolve manually:"
  git diff --name-only --diff-filter=U
  exit 2
fi

echo "All configured conflicts resolved. Creating merge commit..."
git commit -m "Resolve merge conflicts (keep premium landing page branch versions)"
echo "Done. Now push your branch: git push"
