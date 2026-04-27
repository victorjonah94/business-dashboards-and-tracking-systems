# Why You Are Seeing `404: NOT_FOUND` on Vercel

Your screenshots show the root cause clearly:

- GitHub `main` branch still has only the **initial commit**.
- Your landing page work is on a different branch (`codex/build-high-converting-landing-pa...`).
- Vercel production is likely deploying from `main`.

So Vercel is deploying a branch that does not yet contain `index.html`, `styles.css`, `script.js`, and `vercel.json`.

---

## Fix in 5 Minutes

1. Open GitHub and switch to your feature branch (`codex/build-high-converting-landing-pa...`).
2. Create a Pull Request into `main`.
3. Merge the PR.
4. In Vercel -> Project Settings -> Git:
   - Confirm **Production Branch** = `main`.
5. Trigger **Redeploy** in Vercel.

After merge + redeploy, your domain should load the landing page.

---

## Optional Alternative (if you don't want to merge yet)

Set Vercel Production Branch temporarily to your feature branch, then redeploy.

---


## You already created a PR in Codex — next actions

1. Click **View PR** in Codex.
2. Confirm base branch is `main`.
3. Merge the PR (squash or merge commit).
4. Wait for Vercel auto-deploy (or click Redeploy).
5. Hard refresh the site (`Ctrl/Cmd + Shift + R`).

If the PR base is not `main`, edit the PR and target `main`, then merge.

---

## Quick Verification Checklist

- `main` branch contains these files:
  - `index.html`
  - `styles.css`
  - `script.js`
  - `vercel.json`
- Vercel deployment commit SHA matches latest commit on `main`.
- Vercel root directory is `.`.

If these are true, 404 should disappear.
