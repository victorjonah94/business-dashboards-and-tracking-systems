# business-dashboards-and-tracking-systems

A premium, motion-enhanced landing page for attracting high-ticket founders/CEOs in Abuja who need custom business tracking and control systems (sales, expenses, inventory, dashboards).

## Files
- `index.html` — high-converting premium landing page structure
- `styles.css` — modern visual system (Claude-inspired palette), motion effects, responsive layout
- `script.js` — reveal animations + qualification form behavior
- `assets/work/` — place your dashboard screenshots here
- `vercel.json` — rewrite config so all routes resolve to `index.html`
- `HIGH_TICKET_FUNNEL_STRATEGY.md` — full funnel and sales playbook
- `DEPLOYMENT_FIX.md` — branch/deployment troubleshooting guide

## How to add screenshots to the repo filesystem

### Option A: GitHub web (easiest)
1. Open your repo on GitHub.
2. Go to `assets/work/`.
3. Click **Add file** -> **Upload files**.
4. Drag screenshots in (for example: `budget-dashboard.png`, `meal-planner.png`).
5. Commit directly to your working branch, then merge to `main`.

### Option B: Local machine + git
```bash
git clone <your-repo-url>
cd business-dashboards-and-tracking-systems
mkdir -p assets/work
cp /path/to/your/screenshots/*.png assets/work/
git add assets/work
git commit -m "Add dashboard screenshots"
git push
```

### Option C: VS Code / Codex workspace
1. Open the repo folder.
2. Create (or open) `assets/work/`.
3. Drag-and-drop image files into that folder.
4. Commit and push/merge to `main`.

## Wiring screenshots into the landing page
After uploading images, replace each portfolio visual block in `index.html` with an `<img>` tag pointing to your files, for example:

```html
<img src="assets/work/budget-dashboard.png" alt="Budget and cashflow dashboard" loading="lazy" />
```

## Local Preview
Open `index.html` directly in a browser, or run any static server.

## Vercel Deployment Checklist
1. Ensure your latest commit is on the branch Vercel tracks (usually `main`).
2. Set Vercel **Root Directory** to repository root (`.`).
3. Framework preset can be **Other** (static site).
4. Redeploy after merges.


## If you still see old UI after merge
- Do a hard refresh: **Ctrl/Cmd + Shift + R**.
- Open the site in incognito.
- Confirm the deployed HTML references versioned assets (e.g. `styles.css?v=20260427a`).


## Merge conflicts
- If your PR shows conflicts, follow `MERGE_CONFLICT_RESOLUTION.md`.


## One-command conflict fix (for non-technical users)
If your PR says "This branch has conflicts", run:

```bash
git checkout <your-feature-branch>
git merge origin/main
./scripts/resolve_conflicts.sh
```

Then push:

```bash
git push origin <your-feature-branch>
```
