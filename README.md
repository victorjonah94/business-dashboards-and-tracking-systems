# business-dashboards-and-tracking-systems

A deploy-ready landing page for attracting high-ticket founders/CEOs in Abuja who need custom business tracking and control systems (sales, expenses, inventory, dashboards).

## Files
- `index.html` — complete landing page structure and marketing copy
- `styles.css` — page styling and responsive layout
- `script.js` — basic lead-form qualification behavior
- `vercel.json` — rewrite config so all routes resolve to `index.html`
- `HIGH_TICKET_FUNNEL_STRATEGY.md` — detailed strategy playbook

## Local Preview
Open `index.html` directly in a browser, or run any static file server.

## Vercel Deployment Checklist
1. Ensure your latest commit is on the branch Vercel is tracking (usually `main`).
2. In Vercel project settings, set **Root Directory** to repository root (`.`).
3. Framework preset can be **Other** for this static site.
4. Leave build command empty (or use `null`) and publish root.
5. Redeploy after changing project settings.

If Vercel still shows `404: NOT_FOUND`, it usually means the deployment is pointing to the wrong branch or wrong root directory, not that your HTML is invalid.


## Troubleshooting
- See `DEPLOYMENT_FIX.md` for the exact `404: NOT_FOUND` branch/deployment fix path.
