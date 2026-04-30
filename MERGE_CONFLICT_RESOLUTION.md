# Merge Conflict Resolution Guide (for this repo)

If GitHub says your PR has conflicts, use this exact flow.

## Fastest non-technical path (CLI)
Run these commands from your repo clone:

```bash
git checkout <your-feature-branch>
git fetch origin
git merge origin/main
./scripts/resolve_conflicts.sh
git push origin <your-feature-branch>
```

That auto-resolves the files that keep conflicting in this project:
- `README.md`
- `index.html`
- `script.js`
- `styles.css`
- `vercel.json`

## If you want to keep main branch version instead

```bash
./scripts/resolve_conflicts.sh --theirs
```

## GitHub web editor fallback
If you prefer the GitHub UI:
1. Click **Resolve conflicts**.
2. For `README.md`, `index.html`, `script.js`, `styles.css`, keep the feature-branch side.
3. Mark resolved and commit merge.
4. Merge PR.

## Why conflicts keep happening
These files are frequently edited across branches, so Git cannot auto-merge reliably.
Using the script makes the merge deterministic and prevents repeated manual edits.

## Verification after merge
- Open the PR preview deployment.
- Hard refresh (`Ctrl/Cmd + Shift + R`).
- Confirm expected copy/sections are present.
