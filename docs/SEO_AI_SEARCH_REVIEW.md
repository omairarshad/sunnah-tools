# Three-tool search visibility and AI answer-readiness review

Updated: 29 October 2026. Scope: Ramadan Countdown, Laylatul Qadr Nights, White Days Calendar, Fasting Tracker, Fidya Calculator and Kaffarah Calculator.

## Implementation

- Every page has a unique descriptive title, H1, meta description, canonical URL and included sitemap route.
- The substantial explanatory guide is server-rendered in the initial HTML, independently of whether the client-side calculator hydrates.
- Answer-first sections cover definitions, date boundaries, precise examples, exceptions, calculation methodology, FAQs and sources. They use stable fragment anchors and descriptive headings.
- Links to Quranic and hadith references are visible in the article body, with direct links to related Sunnah Tools pages and established explanatory guides.
- The rendered page carries `WebApplication`, `BreadcrumbList`, `FAQPage` and `Article` structured data; `Article.citation` mirrors visible source links. This is descriptive markup, not an assertion of certification or an eligibility guarantee.
- Religious ambiguity is explicit: crescent announcements, actual Laylatul Qadr determination and voluntary fasting exceptions are not inferred from algorithms.
- Interactive dates are not indexed as artificially generated city/date doorway pages. The guides use evergreen query language and explicitly labelled hypothetical worked examples.

## Verification and expectations

The repository's static audit checks the above HTML, named sections, source labels, JSON-LD and sitemap entries. Unit tests separately cover timing boundaries, 29/30-night interpretation, calendar status exclusions and file export formats.

### Fasting/expiation batch addendum

- **Fasting Tracker:** indexable answer-first guide about Qada, categories, obligations versus personal tracking, historic-data migration, privacy, step-by-step example and distinctions from Fidya/Kaffarah. Tests cover corrupted backups, duplicate/future dates and separate voluntary counts.
- **Fidya Calculator:** indexable eligible-days-and-rate explanation, distinction from Qada, sourced elderly-person narration, non-fabricated local rates, anonymous multiple-person breakdown and downloadable conditional example. Avoids automatic claims about cash substitution.
- **Kaffarah Calculator:** separately sourced and indexed oath-versus-Ramadan conditions, feeding/clothing/fasting alternatives, two successive lunar months versus an assumed fixed 60-day period, arithmetic examples and substantive FAQs.

Each has standalone initial-HTML facts, primary citation links and `Article` metadata matching visible content. Automated checks verify these elements, and interactive estimates never create date-specific thin pages or pretend to infer a binding obligation.

Google's official [AI features and your website guidance](https://developers.google.com/search/docs/appearance/ai-features) says the existing search fundamentals remain relevant to AI Overviews and AI Mode; it does not prescribe special AI-only markup. There is **no guarantee** of indexing, a rich result, an AI summary citation or high ranking. Confirm indexing, canonical coverage and queries in Google Search Console after deployment; inspect user engagement before expanding pages further.

## Human accuracy gate

All theological interpretations, Arabic supplication spelling and nuances of exceptional fasting days are flagged for independent, qualified scholarly review in `CONTENT_REVIEW_REGISTER.md`. Technical checks do not substitute for that review.
