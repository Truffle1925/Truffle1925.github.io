# Adding Thunderbird Instagram posts

Edit `dist/thunderbird-posts.js`. The three objects correspond to the three cards on the Thunderbird page, in order.

1. Paste a public Instagram **post** or **reel** link into an empty `url` value. Keep the quotation marks.
2. Replace its `title` with a short description for the fallback link.
3. Save and republish the website files.

Use `https://www.instagram.com/p/…/` or `https://www.instagram.com/reel/…/`. Share-link query parameters are removed automatically. Private posts and posts with embedding disabled may not display. Every configured card retains a direct Instagram link if the embed cannot load.

Empty URLs retain the designed “awaiting dispatch” card. With one or more valid URLs, visitors see a “Load Instagram posts” control. The Instagram script loads only after they choose it. No Instagram password, API token, or account integration is required for these public embed slots.

You can also replace the relevant card markup in `dist/existing/Thunderbird.html` with official copied embed markup if you prefer. The supplied configuration file is the simpler route for keeping the three-column layout consistent.

No post URLs were supplied in this request, so the delivered website contains three empty slots. Actual Instagram embeds have not been verified against specific marketing posts.

Source: Meta's official [Meta Embeds project](https://github.com/facebook/meta-embeds-for-wordpress), which documents Instagram's browser embed script. This static site uses the browser embed, not the WordPress plugin.
