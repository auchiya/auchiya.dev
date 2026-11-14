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
 * Container setup that consumes them:
 *   Trigger   Click - Just Links, "Wait for Tags" enabled, fires when
 *             "Click Element" matches CSS selector `[data-gtm-event]`
 *   Variable  DOM Element, attribute name `data-gtm-event`
 *             DOM Element, attribute name `data-gtm-content-type`
 *             DOM Element, attribute name `data-gtm-content-id`
 *             DOM Element, attribute name `data-gtm-item-list`
 *   Tag       GA4 Event, event name `{{GTM - Event}}`, params
 *             `content_type`, `content_id`, `item_list_name`
 *
 * Register `content_type`, `content_id`, and `item_list_name` as GA4 custom
 * dimensions or they stay invisible in reports.
 *
 * Outbound clicks need no event: GA4 enhanced measurement already sends
 * `click` for them. `outboundLinkAttributes` only attaches project context so
 * a GTM click tag can report it.
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
