# The Mirror Jammu Kashmir (Static Site)

This repository contains a static, Netlify ready website.

## What is inside
- `index.html` Main page
- `styles.css` Styling
- `script.js` Loads all visible content from JSON
- Content JSON (recommended location): `content/`
  - `content/site.json` Header, ticker, weather, labels
  - `content/articles.json` Blog and news posts
  - `content/vlogs.json` Videos (YouTube)
  - `content/historical-docs.json` Historical documents
- Assets: `assets/` (logo and images)

Note: For compatibility with older GitHub uploads, this repo also includes copies of the JSON and key images in the repo root.

## Deploy on Netlify from GitHub
1. In Netlify, choose **Add new site** -> **Import an existing project**
2. Pick this GitHub repo.
3. Build settings:
   - Branch to deploy: `main`
   - Base directory: (leave empty)
   - Build command: (leave empty)
   - Publish directory: `.`
4. Deploy site

If you see `cecil build` anywhere, remove it. This site does not need a build step.

## Connect your custom domain on Netlify
1. Netlify -> Site settings -> Domain management
2. Add domain: `themirrorjk.com` (and optionally `www.themirrorjk.com`)
3. Netlify will show DNS records you must add in your domain registrar.
   - If Netlify is your DNS provider, set Netlify DNS and it will configure automatically.
   - If your registrar manages DNS, add the records Netlify shows (A record for apex, CNAME for www).

## Editing content
All text and items are loaded from JSON files.

### Add a new article
Edit `content/articles.json`
- Add a new item at the top of the `items` array
- Use an ISO date like `2025-12-13`
- Example fields include: `title`, `category`, `excerpt`, `author`, `date`, `readTime`, `image`, `body`

### Add a new vlog
Edit `content/vlogs.json`
- Add a new entry at the top of the `videos` array
- Use `youtubeId` and `title`, plus `date`

### Update weather badges
Edit `content/site.json`
- Update the `weather` list
- Rawalakot is included and displayed in the same line.

After editing JSON, commit and push to GitHub. Netlify will redeploy automatically.
