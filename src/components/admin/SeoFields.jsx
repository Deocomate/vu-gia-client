"use client";

import FormField from "@/components/admin/FormField";

const SEO_FIELDS = [
  { name: "metaTitle", label: "Meta title", fullWidth: true },
  {
    name: "metaDescription",
    label: "Meta description",
    type: "textarea",
    rows: 3,
    fullWidth: true,
  },
  { name: "canonicalUrl", label: "Canonical URL", type: "url", fullWidth: true },
  { name: "ogTitle", label: "OG title" },
  { name: "ogDescription", label: "OG description", type: "textarea", rows: 3 },
  { name: "ogImageId", label: "OG image", type: "media", fullWidth: true },
  { name: "noIndex", label: "No index", type: "boolean", helper: "Không cho index" },
  { name: "noFollow", label: "No follow", type: "boolean", helper: "Không follow link" },
];

export default function SeoFields({ values, onChange }) {
  return (
    <section className="border border-zinc-200 bg-zinc-50 p-4 md:col-span-2">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-950">SEO</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Metadata dùng chung cho Product, Category, NewsArticle và Page.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SEO_FIELDS.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}
