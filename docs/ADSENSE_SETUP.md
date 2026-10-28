# Google AdSense launch checklist — Sunnah Tools
Reviewed against Google publisher guidance on 24 October 2026.

## Current deployment behaviour

Ads are deliberately **OFF** until a real publisher ID, both responsive ad unit IDs, an explicit ads enable switch and the owner's confirmation that Google's certified CMP is configured.

- Without settings, **no AdSense JS**, ad unit markup, ads.txt placeholder or advertising iframe loads.
- With a valid publisher ID alone, HTML can include a Google AdSense account **verification meta tag** and CI writes a correct `/ads.txt` seller declaration. This does **not** start showing ads.
- With all required variables and owner-attested CMP setup, the site loads a single AdSense library and offers **two controlled, manual responsive placements**: one after the homepage tool grid, and one after a tool's main functionality, guides and disclaimer. No ad appears in a calculator input, above the homepage tool directory, inside a printable page or within the embeddable prayer widget.
- The site does not implement Auto ads itself; decide in the AdSense dashboard whether to activate Auto ads. For launch **leave Auto ads OFF** to avoid unwanted anchors, full-screen vignettes and ads inserted among controls.
- A script being configured is not proof Google has approved the site, granted consent or filled an ad request.

## Owner actions (never send private account credentials)

1. Website is already in the AdSense Sites list, awaiting ownership verification and review. Select the **Meta tag** verification method after the public deployment completes. Google reviews site quality and policy eligibility separately.
2. The owner supplied a publisher ID of `ca-pub-5803311676381609`; verify this is still the intended publisher in AdSense `Account > Settings > Account information`. Publisher IDs are public; passwords, banking or identity documents should not be committed.
3. **Ownership verification configured:** AdSense publisher identity `ca-pub-5803311676381609` is stored in `src/lib/adsIdentity.mjs`, and the build emits a site-wide `google-adsense-account` meta tag plus `https://sunnah.tools/ads.txt`. No ad script loads until the separately gated ad-serving flags are enabled. In AdSense > Sites > sunnah.tools choose **Meta tag** (or **Ads.txt snippet**), tick **I've placed the code**, click **Verify**, then **Request review** when available. An optional repository variable `ADSENSE_PUBLISHER_ID` can override the identity only when it uses the full `ca-pub-` form. An existing `pub-...`-only variable is invalid and is safely ignored in favour of the verified publisher identity. You may remove the stale variable; no variable is needed for verification.
4. Complete Google's site approval in AdSense. In **Privacy & messaging**, set up and publish a **European regulations message** for UK and EEA visitors using Google's certified TCF consent system (or an alternative Google-certified CMP). Review country coverage and actual live consent behaviour. This is the publisher's responsibility and a flag alone is **not** proof of compliance. Learn more at https://support.google.com/adsense/answer/10960768 and https://support.google.com/adsense/answer/13554116
5. In `Ads > By ad unit`, create **two responsive Display ad units** (homepage lower grid; tool page below guide). Copy their **numeric ad slot IDs**.
6. Add these repository Actions variables:
   - `ADSENSE_HOME_SLOT`: real numeric homepage ad slot ID
   - `ADSENSE_TOOL_SLOT`: real numeric tool ad slot ID
   - `ADSENSE_CMP_READY`: `true` ONLY after the proper certified CMP is configured and validated
   - `ADSENSE_ADS_ENABLED`: `true` ONLY when the site is approved and ready to serve compliant ads.
7. Rerun the Hostinger publish workflow. Visit a regular browser from relevant regions and test Google consent flow, responsive ads, mobile CLS and calculator input interactions. Review `Ads > Sites` and the AdSense Policy Center. Some ads may take time to appear and can be blocked by browser settings.
8. If Google requests privacy controls or account changes, resolve them **before** making ads live; keep `ADSENSE_ADS_ENABLED=false` as the kill switch.

## Placement strategy

- **Homepage:** max one manual responsive in-page display placement below the tools. All cards, filters and navigation remain ad-free.
- **Tools:** max one placement after the working calculator, explanation and religious accuracy note. Visitors get the answer before encountering any ads.
- **Exclusions:** no ad content in /embed/, about, privacy, guides, print/PDF views.
- If experimentation later justifies a second in-page ad, use deliberate A/B measurement rather than adding multiple ads by default.
- Do not place ad units next to 'Count', 'Print', 'Calculate' or similar actions. Do not style ad labels as buttons or mimic organic tool cards. Never ask or incentivise visitors to click ads.
- Do **not** auto-refresh ad placements; Google disallows refreshing ads without a user-requested refresh.

## Metrics and SEO

- **Primary:** Search Console indexed useful pages, search clicks, query relevance, mobile usability.
- **Revenue:** AdSense Page RPM, impressions, CTR and geography (be careful not to chase CTR with misleading UI).
- **Experience:** Google Search Console Core Web Vitals, mobile LCP, INP and CLS, consent rejection and abandonment.
- Use Google AdSense reports and Search Console separately; neither reports data from this repository.
- SEO cannot be guaranteed. Refine genuine helpful content based on actual search queries instead of mass-producing thin location doorway pages.
- Check actual consent, ad script behavior and legal requirements with a competent reviewer before switching on advertising.

Google references:
- https://support.google.com/adsense/answer/7584263 (site connection)
- https://support.google.com/adsense/answer/12171612 (ads.txt)
- https://support.google.com/adsense/answer/7037624 (manual vs Auto ads)
- https://support.google.com/adsense/answer/1346295 (ad placement)
- https://support.google.com/adsense/answer/13554116 (certified consent)
- https://developers.google.com/search/docs/appearance/page-experience
