# Northstar Studios — GitHub Pages edition

This folder is the ready-to-upload website. No build step, Node installation, plugin, or hosting account integration is needed.

## Publish on GitHub Pages
1. Open the GitHub repository you want to use for the website.
2. Upload **the contents of this folder** to the repository's root and commit them to `main`. The repository should have `index.html`, `assets/`, and `existing/` at its top level. Do not upload this entire folder as an extra nested directory.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select **main** and **/(root)**, then **Save**.
6. GitHub will display the website's address once publication finishes. Future changes committed to the selected branch are published automatically.

The site uses relative links and explicit `.html` page names, so it supports both an account-level website and a project website such as `https://your-account.github.io/your-repository/`. Keep the included `.nojekyll` file. No custom domain is configured.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Edit the developer bio
Open `existing/About.html` and search for **EDIT DEVELOPER BIO**.

The single card uses the base Northstar logo as a portrait placeholder. Replace:
- `Role / discipline`
- `Developer name`
- The paragraph beginning `A short introduction will go here.`

Duplicate the full `<article class="developer-card">…</article>` block to add future developers. No personal details have been filled in for you.

## Edit Jobs
Open `existing/Jobs.html`. The page currently has a short studio introduction and **No open listings**, following the structure of Aggro Crab's Jobs page. No positions, pay, application process, or hiring promises have been invented. Replace the listings section when you are ready to advertise a role.

Reference: https://aggrocrab.com/Jobs

## Edit other content
- `index.html`: homepage
- `existing/Projects.html`: Games page
- `existing/About.html`: About and developer bio
- `existing/Jobs.html`: Jobs page
- `existing/Press.html`: press assets and downloads
- `existing/Contact.html`: studio email and social channels
- `existing/Thunderbird.html` and `existing/GoblinSurvivors.html`: game pages
- `thunderbird-posts.js`: Instagram post/reel links; see `INSTAGRAM-POSTS.md`
- `styles.css`, `pages.css`, `studio.css`, `github-pages.css`: styling
- `script.js`, `inner.js`: motion and interactions

Keep capitalization in filenames and links consistent; GitHub Pages is case-sensitive. The `.html` links are intentional. Do not replace them with the extensionless addresses used by the earlier hosted preview.

All fonts, Bootstrap files, artwork, and photographs required by the site are included. Instagram embeds, itch.io content, and external links require internet access. The motion pause control and reduced-motion behavior are retained.

## Included and excluded
This folder contains only the deployable studio site and these instructions. It excludes personal portfolio archives, résumé content, previous-version screenshots, source-control history, private hosting configuration, and local reference files. The old `existing/Resume.html` is only a redirect to the studio's About page.

Image, map, font, and framework credits are available through `credits.html`.
