/**
 * Renders a JSON-LD `<script>` tag for structured data. `data` should be a
 * plain object built by one of the `src/lib/seo/schemas.js` builders.
 * Renders nothing when `data` is falsy so callers can pass builder results
 * directly without a guard.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  // `JSON.stringify` doesn't escape `<`, so a `</script>`-containing value
  // (e.g. an admin-authored product name) could break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- standard Next.js JSON-LD pattern
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
