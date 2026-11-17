---
name: google-analytics-4
description: "Use when implementing or auditing Google Analytics 4 — gtag.js vs Google Tag Manager, recommended and custom events, parameters and custom dimensions, key events, Consent Mode v2, DebugView, SPA page views, the Measurement Protocol for server events, BigQuery export, and data retention and PII rules."
license: MIT
---

# Google Analytics 4

Implement GA4 so events are named consistently, consent is respected before any tag fires, server-side conversions line up with browser sessions, and reports can actually be trusted.

## When to Use This Skill

- Adding GA4 to a site or single-page app, with gtag.js or GTM
- Designing an event plan (recommended events, parameters, custom dimensions)
- Marking conversions as key events and passing them to Google Ads
- Implementing Consent Mode v2 with a cookie banner/CMP
- Sending purchases, refunds or offline events from a backend via the Measurement Protocol
- Querying raw GA4 data in BigQuery

## gtag.js or GTM

| Option             | Choose when                                                   | Trade-off                                                        |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| gtag.js in code    | Developers own tracking; few tags; events fired from app code | Every change is a deploy                                         |
| Google Tag Manager | Marketing adds/changes tags; many vendors; CMP templates      | Another tool to govern; push to `dataLayer`, not gtag, from code |

Pick one per site. Running both with the same measurement ID double-counts.

## Install with consent defaults first

Order matters: define `gtag`, set consent **defaults**, then load the tag and `config`.

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
    region: ["AT", "BE", "DE", "FR", "IE", "IT", "NL", "ES", "SE", "GB"], // list every EEA country + GB/CH you serve
  });
  gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  }); // everyone else — confirm with legal
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

When the user chooses, call `gtag('consent', 'update', { analytics_storage: 'granted', ... })` on that page. Consent Mode v2 requires `ad_user_data` and `ad_personalization` in addition to `ad_storage` and `analytics_storage`.

- **Basic** consent mode: don't load Google tags until consent is granted — simplest, no data from refusers.
- **Advanced**: tags load with denied defaults and send cookieless pings, which GA4 uses for modeling. Choose deliberately with whoever owns privacy compliance.

## Events

1. Use **recommended event names and parameters** where they fit — reports and Ads integrations understand them: `sign_up` (`method`), `login`, `generate_lead`, `search` (`search_term`), `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (`transaction_id`, `value`, `currency`, `items`), `refund`.
2. Custom events: `snake_case`, ≤ 40 chars, verb_object (`plan_upgrade`, `report_export`). Don't encode values in names (`clicked_button_7`) — use parameters.
3. Limits per event: 25 parameters; parameter names ≤ 40 chars; values ≤ 100 chars (`page_location` 1,000, `page_title` 300).
4. Register parameters you want in reports as **custom dimensions/metrics** (Admin → Custom definitions). Standard properties allow 50 event-scoped, 25 user-scoped, 10 item-scoped dimensions and 50 custom metrics. They are not retroactive and take 24–48 h to appear.
5. Mark business outcomes as **key events** (formerly "conversions"; star the event in Admin → Events) — up to 30 per standard property; only data from then on counts.

```js
gtag("event", "purchase", {
  transaction_id: order.id, // dedupes repeat sends
  value: order.total,
  currency: "USD",
  items: order.lines.map((l) => ({
    item_id: l.sku,
    item_name: l.name,
    price: l.price,
    quantity: l.qty,
  })),
});
```

## Single-page apps

- Preferred: enable Enhanced measurement → Page views → "Page changes based on browser history events". No code needed.
- Manual alternative: `gtag('config', 'G-XXXXXXXXXX', { send_page_view: false })`, then on each route change `gtag('event', 'page_view', { page_location: location.href, page_title: document.title })` after the title updates.
- Never do both, and with GTM don't also enable history tracking in GA4 — page views double.

## Measurement Protocol (server events)

Use it to supplement browser data (offline purchases, refunds, subscription renewals) — not to replace the tag. Create an API secret in the web data stream settings and keep it server-side.

```ts
// clientId: from the _ga cookie or gtag('get', 'G-XXXXXXXXXX', 'client_id', cb), stored with the order
await fetch(
  `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
  {
    method: "POST",
    body: JSON.stringify({
      client_id: clientId,
      user_id: internalUserId, // optional, never an email
      events: [
        {
          name: "refund",
          params: {
            transaction_id: orderId,
            value: 49,
            currency: "USD",
            session_id: sessionId,
            engagement_time_msec: 1,
          },
        },
      ],
    }),
  },
);
```

- Max 25 events per request; events can be backdated up to 72 hours (`timestamp_micros`); body < 130 kB.
- The endpoint returns 2xx even for malformed payloads — validate against `https://www.google-analytics.com/debug/mp/collect` first (non-empty `validationMessages` = problem). Validation hits never reach reports.
- For EU data collection use `region1.google-analytics.com`.

## BigQuery export

- Link in Admin → BigQuery links. Daily export lands in `events_YYYYMMDD`; streaming fills `events_intraday_YYYYMMDD` (best-effort, extra cost). Export starts from the link date — there is no backfill, so link early. Standard properties cap the daily export at 1 million events/day.

```sql
SELECT event_name, COUNT(*) AS events, COUNT(DISTINCT user_pseudo_id) AS users
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20261001' AND '20261021'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') LIKE '%/pricing%'
GROUP BY event_name ORDER BY events DESC;
```

Always filter `_TABLE_SUFFIX` — an unfiltered `events_*` scan bills the whole dataset.

## Retention and PII

- Set Admin → Data retention to 14 months (default is 2) on day one; it only affects explorations and funnels, not standard reports.
- Never send PII (emails, names, phone numbers, precise addresses) in event params, user properties, `user_id`, or URL query strings — strip them from `page_location` before it's sent. Google's terms prohibit it.
- Use an internal opaque ID for `user_id`; filter internal/dev traffic with data filters.

## Rules

- Consent defaults run before the tag; nothing fires with `granted` before the user agrees where consent is required.
- One tagging method per site; one source of truth for page views.
- Recommended events first; custom names follow one convention, documented in a tracking plan.
- Server-side purchase events carry `transaction_id` and the browser's `client_id`.
- No PII anywhere in GA4.

## Common Mistakes

- **Custom parameter missing in reports** → it was never registered as a custom dimension (and isn't retroactive).
- **Server events create "(not set)" sessions** → missing `client_id`/`session_id` from the real browser session.
- **Inflated page views in an SPA** → history tracking plus manual `page_view`, or GTM plus GA4 history tracking.
- **Consent banner "works" but GA cookies set before choice** → consent default placed after `config` or after the GTM container.
- **Purchases double-counted** → re-sent on thank-you page reload without a stable `transaction_id`.

## Verify

- Enable debug (`gtag('config', ID, { debug_mode: true })` or Tag Assistant/GTM Preview) and watch events with parameters in Admin → DebugView.
- In devtools → Application, confirm no `_ga` cookie exists before consent (basic mode) and `gcs`/consent params on `collect` requests (advanced mode).
- POST each server payload to `/debug/mp/collect` in CI and assert `validationMessages` is empty.
- Next day, compare GA4 purchase count and revenue with your database for the same date range.
