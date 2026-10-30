# Sunnah Tools — Real analytics and advertising operations
Updated 30 October 2026.

## What is real

The previous /admin/ page was just links and an optional Looker iframe; it did not query Google Analytics. The new /admin/ has a real GA4 Data API reporting interface, triggered only after the owner signs in to their own Google account.

Once connected, it reads active users, sessions, page views, events, daily traffic, top pages/tools, countries and acquisition channels for 7, 28 or 90 days, plus separate live users and event counts from the last 30 minutes. The dashboard uses the actual Google Analytics API response, not local counters or fabricated sample metrics. No GA4 data is displayed until authorised and retrieved.

Google OAuth is read-only (analytics.readonly). For easier refreshes, the checked "Keep me connected" option retains a **short-lived token in the current tab's sessionStorage**. This token can be read by JavaScript running on the same origin; use a trusted browser/device. The token expires and is cleared after Google rejects it or when Disconnect is clicked. Unchecking the option deletes the stored copy; reports themselves are not stored. No refresh token, service account secret, or client secret is embedded or saved. Hostinger protects /admin/ with an owner-configured password; Google independently restricts underlying property access. AdSense revenue remains in private AdSense Reports.

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
6. Open https://sunnah.tools/admin/ and connect Google. Refresh requests both the historical and 30-minute Realtime endpoints. A short-lived session token can survive refreshes in the same tab, but requires reauthorisation after expiry. Disconnect clears that token.

Realtime reports typically populate within minutes of consented visits; standard reporting can take 24–48 hours. Consent denial and browser blockers limit coverage. An empty report is not proof of zero real website visitors. Never enter a password, bank detail, client secret or access token in static configuration.

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

## AdSense revenue dashboard (prepared while approval is pending)

The owner dashboard now has a **separate AdSense read-only connection**. It does not use GA4 visits to guess earnings, never adds YouTube payouts to Sunnah Tools totals, and does not enable advertising. It looks up accounts and the exact `sunnah.tools` site, displays its Google approval state, and requests site-filtered income only when the site has state `READY`. Revenue reports use the AdSense Management API v2 with `OWNED_SITE_ID` filtering and the `ESTIMATED_EARNINGS`, `PAGE_VIEWS`, `IMPRESSIONS`, `CLICKS`, `PAGE_VIEWS_RPM` and `IMPRESSIONS_CTR` metrics. Realtime traffic comes from GA4 separately. AdSense earnings are not live visitor metrics and may be revised.

**Owner setup, no website code edits required:**
1. In the existing Sunnah Tools Google Cloud project enable **AdSense Management API** from APIs & Services → Library: https://console.cloud.google.com/apis/library/adsense.googleapis.com .
2. Open Google Auth Platform → Data Access and add `https://www.googleapis.com/auth/adsense.readonly` to the existing OAuth consent app. If the app is External/Testing, keep the owner’s Google email in Test users. Google can show a new scope/verification prompt; use only the account authorised for AdSense. No extra OAuth web client is needed; continue using the configured public Google OAuth Client ID. No client secret or refresh token should enter GitHub.
3. Once deployed, open the Hostinger-protected `/admin/` page and select **Connect AdSense**. Consent to *read-only* access. The dashboard identifies the site by exact domain; if it is still `GETTING_READY`, no earnings figures are shown. A separate short-lived access token can survive a same-tab refresh if its remember option is checked. Disconnect clears it.
4. When the site becomes **Ready**, the dashboard requests estimated earnings for today, yesterday, this month and last 30 days, a daily earnings chart and performance metrics. Currency is taken from API response headers. **Payment balance and most recent account payment are for the whole AdSense account**, not necessarily earnings attributable to sunnah.tools. The AdSense Management API does **not** return the ads.txt crawler status; confirm that separately in AdSense → Sites.

**Ad launch is separate:** while AdSense site review says Getting ready, leave the GitHub Actions advertising enablement flags off. Keep Auto ads and Auto optimise off for controlled placement. After Ready, verify `/ads.txt` and a certified UK/EEA/Swiss consent message under AdSense Privacy & messaging, create two responsive Display ad units (homepage and tool pages), verify placement accessibility and consent requests in a real browser, then and only then enable `ADSENSE_SITE_READY`, `ADSENSE_CMP_READY`, both slot variables and `ADSENSE_ADS_ENABLED`. No advertising is activated merely by connecting revenue reports.

API documentation:
- https://developers.google.com/adsense/management/reference/rest/v2/accounts.sites/list
- https://developers.google.com/adsense/management/reference/rest/v2/accounts.reports/generate
- https://developers.google.com/adsense/management/reporting/filtering
- https://developers.google.com/adsense/management/metrics-dimensions
