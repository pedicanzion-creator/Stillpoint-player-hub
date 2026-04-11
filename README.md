# STILLPOINT — GitHub Pages PWA Deployment

Host the STILLPOINT player's guide as an installable PWA your players can add to their phones.

---

## File Structure

Your repo should look like this:

```
your-repo/
├── index.html          ← the main app (already PWA-ready)
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker (enables offline + install)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── README.md
```

---

## Step 1 — Create a GitHub Account & Repo

1. Go to [github.com](https://github.com) and sign up (free)
2. Click **+** → **New repository**
3. Name it anything — e.g. `stillpoint` or `stillpoint-guide`
4. Set it to **Public** (required for free GitHub Pages)
5. Click **Create repository**

---

## Step 2 — Upload the Files

**Easiest way (no Git required):**

1. In your new repo, click **Add file → Upload files**
2. Drag in `index.html`, `manifest.json`, `sw.js`
3. Click **Add file → Upload files** again
4. Create the `icons/` folder: type `icons/` in the path box, then upload the three PNG files
5. Commit each upload

**Or use Git:**
```bash
git clone https://github.com/YOUR_USERNAME/your-repo.git
# copy all files in
git add .
git commit -m "Initial STILLPOINT PWA"
git push
```

---

## Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` — Folder: `/ (root)`
4. Click **Save**
5. Wait ~2 minutes. Your site will be live at:

```
https://YOUR_USERNAME.github.io/your-repo-name/
```

GitHub Pages provides HTTPS automatically — this is required for PWAs to work.

---

## Step 4 — Test It

Open the URL on your phone:

**Android (Chrome):**
- You'll see an "Add to Home Screen" banner automatically
- Or tap ⋮ menu → "Add to Home Screen" / "Install app"

**iPhone/iPad (Safari):**
- Tap the **Share** button (box with arrow)
- Scroll down and tap **"Add to Home Screen"**
- Tap **Add**

The app installs like a native app and works offline.

---

## Updating the App

Whenever you update `index.html`, you **must also bump the version** in `sw.js` so players get the new version instead of the cached one.

Open `sw.js` and change this line:
```js
var VERSION = 'v2025-04-11';  // ← change the date
```
Then commit and push. Players will get the update automatically on next load.

---

## Custom Domain (Optional)

If you want `stillpoint.yourdomain.com` instead of the GitHub URL:

1. In your domain registrar, add a CNAME record pointing to `YOUR_USERNAME.github.io`
2. In **Settings → Pages → Custom domain**, enter your domain
3. Tick **Enforce HTTPS**
4. Update `manifest.json` — change `start_url` and `scope` to `/` (root, no subfolder needed)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| App not installable | Open DevTools → Application → Manifest and check for errors |
| Old version showing | Bump `VERSION` in `sw.js` and push |
| Icons not showing | Make sure the `icons/` folder was uploaded correctly |
| Offline not working | Check DevTools → Application → Service Workers |

Use **Chrome DevTools → Lighthouse** (mobile preset) to audit your PWA — it'll show a score and flag any missing requirements.
