/**
 * Google Tag Manager data attributes
 * =================================
 *
 * Custom events are declarative: components tag the element that produces the
 * interaction and GTM reads those attributes at click time. No analytics code
 * runs in the app, so changing what is tracked is a container-only change.
 *
 * Do not call `gtag("event", ...)` or push to `dataLayer` from components; add
 * an attribute here instead.
 *
 * The container setup that consumes these attributes is documented in
 * `docs/gtm-setup.md`. Until it is configured, the attributes are inert —
 * enhanced measurement still records page views, scroll, and generic outbound
 * clicks, but not which project or entry was opened.
 *
 * Register `content_id` and `link_type` (and `content_type` / `item_list_name`
 * if not already standard) as GA4 event-scoped custom dimensions or they stay
 * invisible in reports.
 */

type ContentAttributes = {
  contentType: "project" | "misc";
  contentId: string;
};

/** Internal list-to-detail click. GA4 recommended event and parameter names. */
export function selectContentAttributes({
  contentType,
  contentId,
  itemList,
}: ContentAttributes & { itemList: string }) {
  return {
    "data-gtm-event": "select_content",
    "data-gtm-content-type": contentType,
    "data-gtm-content-id": contentId,
    "data-gtm-item-list": itemList,
  };
}

/** Context for outbound links, read by a GTM click tag. Fires no event. */
export function outboundLinkAttributes({
  contentType,
  contentId,
  linkType,
}: ContentAttributes & { linkType: string }) {
  return {
    "data-gtm-content-type": contentType,
    "data-gtm-content-id": contentId,
    "data-gtm-link-type": linkType,
  };
}
