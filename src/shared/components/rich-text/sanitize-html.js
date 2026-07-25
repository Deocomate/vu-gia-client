/**
 * Hand-rolled whitelist HTML sanitizer for inline rich-text content (no
 * third-party library). Only `<strong>`, `<br>`, and text nodes survive;
 * `<b>` normalizes to `<strong>`; everything else (including scripts, event
 * handlers, styles, links) is unwrapped down to its own text content.
 *
 * String/regex-based (not DOM-based) so it works identically during SSR
 * (Server Components render this at request time, no `document` available)
 * and in the browser — a DOM-based version returned "" on the server,
 * blanking every rich-paragraph block in the initial HTML until hydration
 * patched it in (which `dangerouslySetInnerHTML` mismatches aren't
 * guaranteed to do).
 */

const ALLOWED_TAGS = new Set(["strong", "b", "br"]);
// Code/CSS-bearing tags: drop entirely (including text content), never
// unwrap — their "text" is script/style source, not real user content.
const DROP_ENTIRELY_TAGS = ["script", "style"];

export function sanitizeInlineHtml(html) {
  if (!html) return "";

  let result = html;

  // Strip HTML comments outright.
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Drop code/CSS-bearing elements entirely, including their content.
  DROP_ENTIRELY_TAGS.forEach((tag) => {
    result = result.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "");
  });

  // Normalize <b>/<B> to <strong> before the generic pass below so it's
  // recognized as an allowed tag rather than stripped as unknown.
  result = result.replace(/<(\/?)b\b[^>]*>/gi, (_match, closing) => (closing ? "</strong>" : "<strong>"));

  // Generic pass: any other tag is unwrapped (removed, text content kept);
  // allowed tags are kept but stripped of all attributes.
  result = result.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, closing, tagName) => {
    const lower = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (lower === "br") return "<br>";
    return closing ? `</${lower}>` : `<${lower}>`;
  });

  return result;
}
