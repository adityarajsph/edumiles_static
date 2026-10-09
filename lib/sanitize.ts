/**
 * lib/sanitize.ts
 * HTML sanitizer for rich text content to prevent XSS.
 *
 * Whitelist updated to support all Tiptap-generated content:
 *   - Full heading/block/inline HTML
 *   - Images with style attributes (alignment, sizing)
 *   - Figure + figcaption (image captions)
 *   - Tables
 *   - YouTube iframes (strictly limited to youtube-nocookie.com / youtube.com)
 *   - Highlight marks, text colour spans
 *   - Horizontal rules, code blocks
 *
 * Security:
 *   - All <a> tags forced to rel="noopener noreferrer"
 *   - <iframe> only allowed from YouTube / YouTube-nocookie domains
 *   - No script/event attributes ever allowed
 *   - allowedSchemes: https, http, mailto only
 */

import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  // Headings
  "h1", "h2", "h3", "h4", "h5", "h6",
  // Block
  "p", "div", "section", "article", "main", "header", "footer",
  // Inline
  "span", "strong", "b", "em", "i", "u", "s", "del", "ins",
  "sup", "sub", "mark", "small",
  // Line
  "br", "hr",
  // Lists
  "ul", "ol", "li",
  // Quote / code
  "blockquote", "pre", "code",
  // Links
  "a",
  // Images + captions
  "img", "figure", "figcaption",
  // Table
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  // Media (strictly filtered below)
  "iframe",
];

const ALLOWED_ATTRS: sanitizeHtml.IOptions["allowedAttributes"] = {
  // Allow style + class on everything for alignment, colour, highlight
  "*": ["class", "style"],
  // Links
  "a":  ["href", "target", "rel", "title"],
  // Images
  "img": ["src", "alt", "width", "height", "loading", "title"],
  // Tables
  "th": ["colspan", "rowspan", "scope"],
  "td": ["colspan", "rowspan"],
  "col": ["span"],
  // iframes — only YouTube
  "iframe": [
    "src", "width", "height",
    "frameborder", "allow", "allowfullscreen",
    "title", "referrerpolicy",
  ],
};

export function sanitizeRichText(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["https", "http", "mailto"],

    // Force all <a> tags to be safe
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),

      // Only allow iframes from YouTube — strip everything else
      iframe: ((_tagName: string, attribs: Record<string, string>) => {
        const src = attribs.src || "";
        const isYoutube =
          src.startsWith("https://www.youtube.com/embed/") ||
          src.startsWith("https://www.youtube-nocookie.com/embed/") ||
          src.startsWith("https://youtube.com/embed/");

        if (!isYoutube) {
          // Replace with an empty paragraph (discards the iframe)
          return { tagName: "p", attribs: {} };
        }

        return {
          tagName: "iframe",
          attribs: {
            src,
            width:           attribs.width  || "640",
            height:          attribs.height || "360",
            frameborder:     "0",
            allow:           "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "true",
            referrerpolicy:  "strict-origin-when-cross-origin",
            style:           "max-width:100%;border-radius:10px;",
          },
        };
      }) as sanitizeHtml.Transformer,
    },

    // Disallow any on* event attributes that sanitize-html might let through
    disallowedTagsMode: "discard",
  });
}

export default sanitizeRichText;
