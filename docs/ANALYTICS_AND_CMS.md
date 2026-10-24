# Sunnah Tools — Homepage CMS & Analytics (October 2026)

## What this release implements

**Homepage promotions:** prominent ArabicAlphabet.app card above the tool directory, plus IslamReact on YouTube and Meem & Moon Islamic merchandise. All three are marked as external destinations and open in a new tab.

**Editable homepage:** the site reads `src/data/homepage.json`. The editor can change intro copy and visibility, featured tool slugs and order, promotional card text/URLs/colour/visibility/order, section order, and desktop grid columns. The core tool directory is always present to avoid accidentally removing utility content or search pages.

**Secure editor:** `.pages.yml` configures [Pages CMS](https://app.pagescms.org/), which edits the GitHub source repository after *GitHub authentication*. The static `/admin/` page is a link hub, **not** an unauthenticated write API. Website visitors cannot change content from /admin/. Never give the browser a GitHub personal access token.

**Analytics:** optional GA4 client integration. Default: entirely OFF. Once GA4 is configured in repository variables, it uses a small opt-in preference UI. No `gtag.js` network request is made before a visitor accepts; the preference is stored locally and can be changed using the footer button. GA4 events only include `promotion_id`, `tool_slug` and generic `tool_search_used` (no search text, geolocation, financial fields, prayer tracker values, or other personal form content). Google Analytics can be blocked by browser privacy extensions; traffic is consent-limited, not a census.

**Dashboard:** `/admin/` presents access to:
- Pages CMS (edit homepage, GitHub sign-in)
- GA4 (users, sessions, page views, source/medium, countries, custom events)
- Search Console (search impressions, clicks, keywords, indexing)
- AdSense (revenue, page RPM, policy status)
- GitHub build monitoring
- A configured private Looker Studio report (optional embedded report view, access still controlled by Google). The site **does not fabricate metrics** or collect Analytics Data API credentials in its public static JavaScript.

## Activate content editing

1. Open https://app.pagescms.org and sign in with GitHub.
2. Install or approve Pages CMS GitHub App access for **only** `omairarshad/sunnah-tools`. Pages CMS is a third-party service; review the permissions it requests.
3. Open the repository, choose **`feature/initial-site-and-tools`** (the source branch; **not** the generated `hostinger-live` branch, which is overwritten on every release).
4. Open **Homepage layout & cards**.
5. Edit the three external promotions, section ordering, featured tools, colours, headings or number of columns. Save. GitHub Actions will validate and publish the resulting source; Hostinger may require a redeploy depending on the app connection.
6. If Pages CMS does not offer the desired branch in your account, edit `src/data/homepage.json` using GitHub's file editor on `feature/initial-site-and-tools`, and commit to the source branch. **Do not** edit the generated `hostinger-live` branch.
7. Edits are versioned; GitHub commits can be reverted if an incorrect card is published.

The CMS manages a typed JSON file, not arbitrary HTML or JavaScript. URLs are validated to allow only HTTPS external links. Invalid URLs are omitted rather than becoming clickable javascript: links.

## Activate Google Analytics 4

1. Go to https://analytics.google.com/, create a GA4 property and web data stream for `https://sunnah.tools/` (if you have not already), and copy your `G-...` **Measurement ID**.
2. In GitHub → `omairarshad/sunnah-tools` → Settings → Secrets and variables → Actions → **Variables**, set:
   - `GA4_MEASUREMENT_ID` to your real `G-...` measurement ID.
   - `GA4_ENABLED` to `true` only after reviewing the privacy policy and optional consent UI.
3. Trigger `Build static site for Hostinger` from the source branch or publish a source commit to regenerate the static site. The GitHub workflow maps those variables to compile-time `PUBLIC_GA4_...` Astro settings.
4. Check the public website in an incognito browser. A small optional analytics preference panel should appear. Before accepting, there must be **no** request to `www.googletagmanager.com/gtag/js`; after accepting, the GA4 tag should load. Declining should leave GA4 completely unloaded on a fresh page. Returning visitors retain their choice in browser-local storage.
5. In GA4, use Realtime and DebugView to verify visits. Custom events: `promotion_click` (`promotion_id`), `tool_open` (`tool_slug`), `favorite_toggle` (`tool_slug`), `tool_search_used` (event only). If you want to use the custom parameters as GA4 report dimensions, register them as event-scoped custom dimensions; events alone do not automatically appear as configured dimensions.
6. For detailed dashboard reporting, open https://lookerstudio.google.com/ and create a report connected to the GA4 property. Include scorecards and charts for Users, Sessions, Views, Countries, Source/Medium, Top Pages, and Events over Time. Restrict sharing to your own Google account.
7. If you want the report to appear within `/admin/`, set the GitHub Actions variable `LOOKER_STUDIO_REPORT_URL` to the private report URL and republish. Google still controls access; if embedding is blocked, use the direct private report link instead. **Never** make a report public solely to make an iframe work.

## Revenue and privacy

- The Google Analytics consent preference is for **analytics only**. It **does not replace Google's certified CMP / TCF European regulations message** needed for AdSense when serving certain traffic.
- Do not configure `ADSENSE_ADS_ENABLED=true` until publisher approval and certified consent setup are verified. See `docs/ADSENSE_SETUP.md`.
- Analytics and advertisements should not load on the self-contained prayer times embed by default.
- The dashboard is a **public noindex navigation shell**; the sensitive Google reports and GitHub edits remain protected by Google's and GitHub's authentication. Do not place private API keys, GA4 service-account credentials or revenue export files on this static page.
- Treat visitor consent, privacy policy, access permissions and paid advertisements as ongoing operational responsibilities.
- SEO impact is not guaranteed by adding cross-promotion cards. Track search clicks, organic landing pages, CTR and visitor engagement; keep calculators prominent.

## Next possible features

- Optional promotional card scheduling and rotating home cards after basic analytics reveals actual engagement.
- More substantive, independently verified Arabic learning tools linking to the dedicated ArabicAlphabet.app property.
- Periodic internal SEO performance review using real Search Console queries, not synthetic search-volume guesses.
- A proper unified authenticated dashboard with GA4 API + Google OAuth would require a secure server-side proxy or third-party hosted analytics service; it cannot be safely implemented by placing credentials in this static Hostinger frontend.
