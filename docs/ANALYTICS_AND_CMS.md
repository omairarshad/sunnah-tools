# Sunnah Tools — Real analytics and advertising operations
Updated 30 October 2026.

## What is real

The previous /admin/ page was just links and an optional Looker iframe; it did not query Google Analytics. The new /admin/ has a real GA4 Data API reporting interface, triggered only after the owner signs in to their own Google account.

Once connected, it reads active users, sessions, page views, events, daily traffic, top pages/tools, countries and acquisition channels for 7, 28 or 90 days. The dashboard uses the actual Google Analytics API response, not local counters or fabricated sample metrics. No GA4 data is displayed until authorised and retrieved.

Google OAuth is read-only (analytics.readonly); its access token remains in browser memory. No service account keys or confidential tokens are embedded into static pages. GA4 Google sign-in controls who can access the underlying property; the /admin/ URL itself is public and noindex, not a login wall. AdSense revenue remains separate in the private AdSense Reports.

## Owner setup — GA4 collection and reporting

1. In https://analytics.google.com/ create or open the Sunnah Tools GA4 property, with a web data stream for https://sunnah.tools. Note the G- Measurement ID and the numeric Property ID, which are different.
2. In https://console.cloud.google.com/ enable Google Analytics Data API for your Cloud project. Configure OAuth consent and create a Web application OAuth Client ID; allow https://sunnah.tools as an authorised JavaScript origin. If the app is in Testing mode, add the owner's Google email as a test user. Give the owner Google Analytics property access. Do not generate or upload an OAuth client secret or service account private key.
3. Set these public repository Actions variables (Settings → Secrets and variables → Actions → Variables):
   - GA4_MEASUREMENT_ID = the G-… web stream measurement ID
   - GA4_ENABLED = true (only after reviewing the opt-in consent design)
   - GA4_PROPERTY_ID = the numeric property ID
   - GOOGLE_OAUTH_CLIENT_ID = the OAuth Web client ID ending in .apps.googleusercontent.com
4. Re-run Build static site for Hostinger from feature/initial-site-and-tools or commit a source change.
5. Visit the live site in an incognito browser, decline optional GA4 and confirm no tag loads; then grant consent, visit a few pages and check GA4 Realtime.
6. Open https://sunnah.tools/admin/ and click Connect Google Analytics. Authorise read-only Analytics access and select 7, 28 or 90 days; Refresh fetches new reports. Disconnect hides data and clears the in-memory token.

GA4 reporting may be delayed, and consent denial and browser blockers reduce coverage. An empty report does not imply zero real website traffic. Never enter a password, a bank detail, a client secret or an access token into the static website configuration.

## Events and privacy

GA4 requests do not occur before optional opt-in; initial Google consent mode v2 defaults are all denied. The GA4 script loads only after visitor approval. Denying a previously approved choice reloads the page to unload the tracking tag.

Tracked events: page_view and (on consent only) promotion_click with promotion_id, tool_open with tool_slug, and tool_search_used without the search text. Neither form values, financial figures, geolocation, entered prayer data, nor tracker history are sent. To see promotion or tool parameters separately in GA4 Reports, register event-scoped custom dimensions for promotion_id and tool_slug. Top Pages and daily traffic do not require custom dimensions.

## AdSense setup and safety

The site has the owner's existing YouTube AdSense publisher identity for site meta verification and ads.txt. The screenshot of Ads → By site shows sunnah.tools and Auto ads OFF but does not establish Sites approval.

Before serving ads: open AdSense → Sites and confirm the site status reads Ready. In Privacy & messaging publish a Google-certified TCF consent message for UK, EEA and Swiss visitors; confirm consent choices and Google Consent Mode integration in a real browser. The optional website GA4 consent choice is not a substitute for Google's certified CMP. Google requires a certified CMP for personalised ads for these regions.

Keep Auto ads and Auto optimise OFF for controlled manual positions. Under Ads → By ad unit create two responsive Display ads and copy numeric slot IDs. Manual positions are already present after the homepage tool list and below the main tools; never interrupt a calculation.

Only after approval, CMP and testing, set Actions variables ADSENSE_SITE_READY=true, ADSENSE_CMP_READY=true, ADSENSE_HOME_SLOT, ADSENSE_TOOL_SLOT and ADSENSE_ADS_ENABLED=true. Missing any of these keeps adverts disabled. Never activate these variables based only on a site appearing in the Ads tab.

Use separate AdSense Payments accounts for website versus YouTube once available and check the correct bank method for the website; do not change the existing YouTube payment method without a clear reason.


## Rebuilding after GitHub Actions variable changes

GitHub Actions repository variables such as `GA4_MEASUREMENT_ID`, `GA4_PROPERTY_ID`, `GOOGLE_OAUTH_CLIENT_ID` and `GA4_ENABLED` are read at **build time**. A Hostinger **Manual deployment** of the existing `hostinger-live` branch only republishes previously generated files and does not incorporate changed GitHub variables. After adding or updating these variables, use GitHub → Actions → **Build static site for Hostinger** → **Run workflow** and choose `feature/initial-site-and-tools` (or push a commit to that source branch). Wait for the Actions publish step to update `hostinger-live`, then verify the generated `admin/index.html` contains a nonempty `data-property-id` and `data-client-id` before testing `/admin/` through Hostinger. Do not edit `hostinger-live` directly. The OAuth client ID and GA4 IDs are public configuration, not private tokens.

## Other real data sources

- https://search.google.com/search-console/ — actual Google search impressions, clicks, rankings and indexing
- https://analytics.google.com/analytics/web/ — GA4 Realtime, explorations and events
- https://www.google.com/adsense/ — actual revenue, RPM, policy status and payments
- https://app.pagescms.org/ — GitHub-authenticated homepage editing; use source branch feature/initial-site-and-tools, never generated hostinger-live
- https://github.com/omairarshad/sunnah-tools/actions — build and deployment results

Official references: https://support.google.com/analytics/answer/14183469 , https://developers.google.com/analytics/devguides/reporting/data/v1 , https://developers.google.com/tag-platform/security/guides/consent , https://support.google.com/adsense/answer/12170222 , https://support.google.com/adsense/answer/13554116 .
