# GTM setup for auchiya.dev

The app adds declarative `data-gtm-*` attributes to links, but those attributes are
inert until a tag reads them. This guide is the container-side setup that makes
them useful. Work in a **draft version**, test with **Preview**, then publish.

Details that matter:

- Container: `GTM-NVBR8SNV` (currently uses Google's "Google tag" type with
  enhanced measurement built into GTM, destination `G-1WRSNRC9Z2`).
- GTM is loaded **only after consent**. Every tag below inherits that: nothing
  fires for a visitor who declines.
- SPA page views, scroll, and generic outbound clicks are **already handled** by
  enhanced measurement. Do not add a second `page_view` tag or enable enhanced
  measurement page views in the GA4 data stream too — that double-counts.

## 1. Variables

Variables → User-Defined → New. Each is a **DOM Element** variable, Method
**Attribute**, with the attribute name below. Leave the element field unset so
it auto-scopes to the clicked element in a click trigger.

| Variable name        | Attribute               |
| -------------------- | ----------------------- |
| `GTM - Event`        | `data-gtm-event`        |
| `GTM - Content Type` | `data-gtm-content-type` |
| `GTM - Content Id`   | `data-gtm-content-id`   |
| `GTM - Item List`    | `data-gtm-item-list`    |
| `GTM - Link Type`    | `data-gtm-link-type`    |

If a DOM Element variable returns blank in Preview, use a Custom JavaScript
variable instead, e.g.:

```js
function () {
  return {{Click Element}}.getAttribute("data-gtm-event");
}
```

Also enable the built-in `Click Element` and `Click URL` variables under
Variables → Built-In → Configure (needed for the triggers below and for
`link_url`).

## 2. Triggers

### 2.1 `Click - select_content`

- Trigger type: **Click - All Elements**
- This trigger fires on: **Some Click Events**
- Condition: `Click Element` `matches CSS selector` `[data-gtm-event]`

Use **All Elements**, not Just Links with "Wait for Tags": these are Next.js
`next/link` client-side navigations, so the page never unloads and there is no
hit to lose. "Wait for Tags" on Just Links can interfere with the SPA router.

### 2.2 `Click - outbound link (project)`

- Trigger type: **Click - Just Links**
- This trigger fires on: **Some Link Clicks**
- Condition: `Click Element` `matches CSS selector` `[data-gtm-link-type]`

No "Wait for Tags" needed — these links open in a new tab (`target="_blank"`).

## 3. GA4 event tags

Both tags attach to the existing **Google tag** configuration
(`G-1WRSNRC9Z2`). In the tag UI that is the "Configuration tag" field.

### 3.1 `GA4 - select_content`

- Tag type: **Google Analytics: GA4 Event**
- Event name: `{{GTM - Event}}` (resolves to `select_content`)

| Parameter        | Value                    |
| ---------------- | ------------------------ |
| `content_type`   | `{{GTM - Content Type}}` |
| `content_id`     | `{{GTM - Content Id}}`   |
| `item_list_name` | `{{GTM - Item List}}`    |

- Triggering: `Click - select_content`

Example data this produces: a click on "Solar Thermal Calculator" in the
portfolio list fires `select_content` with `content_type=project`,
`content_id=solar-calculator`, `item_list_name=portfolio_projects`.

### 3.2 `GA4 - click_outbound_link`

Use a distinct event name on purpose: enhanced measurement already sends the
recommended `click` event for outbound links. A second `click` would inflate
that event. `click_outbound_link` follows the verb_object custom-name convention.

- Tag type: **Google Analytics: GA4 Event**
- Event name: `click_outbound_link` (literal string)

| Parameter      | Value                    |
| -------------- | ------------------------ |
| `content_type` | `{{GTM - Content Type}}` |
| `content_id`   | `{{GTM - Content Id}}`   |
| `link_type`    | `{{GTM - Link Type}}`    |
| `link_url`     | `{{Click URL}}`          |

- Triggering: `Click - outbound link (project)`

`link_type` is `live`, `repo`, or `related`, so you can see which kind of link
on a project page people follow.

## 4. Register custom dimensions in GA4

Admin → Custom definitions → Create custom dimension, scope **Event**, with
names matching the parameters exactly:

- `content_id`
- `link_type`
- `content_type` and `item_list_name` — check whether GA4 already exposes them
  as standard dimensions; register them only if it does not.

Custom dimensions are **not retroactive** and can take 24–48 h to appear, so do
this before publishing the tags.

## 5. Disable automatic PII collection

The published container currently has automatic detection of email, phone, and
address enabled (Google's "first-party data" collection). Your consent state
blocks it in practice, but the site's privacy policy says no PII is processed,
so remove the capability:

- Open the **Google tag** tag for `G-1WRSNRC9Z2`.
- Under its advanced / user-provided-data settings, turn **off** automatic
  collection of email, phone number, and address. Leave manual entry off.

The exact label varies with GTM versions; look for "User-provided data" or
"First-party data" in the tag configuration.

## 6. Optional: content views on detail pages

`select_content` measures list → detail clicks, not reads. If you want to know
which project/entry pages are actually viewed, that needs a small code change:
add data attributes to the `<article>` in `app/projects/[slug]/page.tsx` and
`app/misc/[slug]/page.tsx`, then fire a GA4 `view_item` event on page view with
those params. Ask me if you want this; it is deliberately left out here so the
code stays free of analytics logic.

## 7. Verify before publishing

1. GTM **Preview** on `https://auchiya.dev` (or on any host with `?gtm_debug=1`).
2. Click a project row on `/projects` → `GA4 - select_content` must fire, with
   all three parameters populated.
3. Open a project, click "Live site" → `GA4 - click_outbound_link` must fire
   with `link_type=live` and the right `content_id`.
4. GA4 → Admin → DebugView (or Realtime) shows the events with parameters.
5. Fresh incognito tab: no `_ga` cookie before Accept. After declining via
   "Cookie settings" in the footer, clicks must produce no hits.

Publish the draft only after all five checks pass.
