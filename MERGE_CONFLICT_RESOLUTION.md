# Merge Conflict Resolution Guide (for this repo)

If GitHub says your PR has conflicts, use this exact flow.

## Fastest (GitHub UI)
1. Open the PR.
2. Click **Resolve conflicts**.
3. For each file, keep the **new premium landing page branch changes** for:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `vercel.json`
4. Keep whichever `README.md` version includes both:
   - screenshot upload instructions
   - Vercel checklist
5. Mark resolved, commit merge, then merge PR.

## CLI flow (recommended)
```bash
# 1) Get latest main
git checkout main
git pull origin main

# 2) Switch back to your feature branch
git checkout <your-feature-branch>

# 3) Merge main into feature branch
git merge origin/main

# 4) Resolve conflicts in editor, then:
git add index.html styles.css script.js README.md vercel.json

# 5) Finish merge
git commit

# 6) Push resolved branch
git push origin <your-feature-branch>
```

## Conflict policy for this project
- Prefer **feature branch** content for UI files (`index.html`, `styles.css`, `script.js`).
- Prefer **most complete combined content** for docs (`README.md`, `DEPLOYMENT_FIX.md`).
- Keep `vercel.json` rewrite in place.

## Verification before final merge
- Open Vercel preview URL from the PR.
- Confirm page shows **UI V2** badge and premium launch bar.
- Hard refresh (`Ctrl/Cmd + Shift + R`) and recheck.
