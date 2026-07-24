"use client";

import FormField from "@/shared/components/admin/form-field";

const SEO_FIELDS = [
  { name: "seoTitle", label: "SEO title", fullWidth: true },
  { name: "seoDescription", label: "SEO description", type: "textarea", rows: 3, fullWidth: true },
  { name: "seoImage", label: "SEO image", type: "media", fullWidth: true, folder: "seo" },
];

export default function SeoFields({ values, onChange }) {
  return (
    <section className="border border-zinc-200 bg-zinc-50 p-4 md:col-span-2">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-950">SEO</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Metadata dùng chung cho Product, Category, News và Page.
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
