"use client";

import { useMemo } from "react";
import { ImageField } from "@/shared/components/admin/inputs/image-uploader";
import SearchableSelect from "@/shared/components/admin/inputs/searchable-select";
import DatePicker from "@/shared/components/admin/inputs/date-picker";
import BlockBuilder from "@/shared/components/blocks/editor/block-builder";
import BlockRenderer from "@/shared/components/blocks/block-renderer";
import { categoryBlockRegistry } from "@/shared/components/category-blocks/registry";
import CategoryDetailContent from "@/features/storefront/products/components/category-detail-content";

const inputClass =
  "h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const textareaClass =
  "min-h-[120px] w-full border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

export default function FormField({ field, value, onChange, error }) {
  const id = `field-${field.name}`;
  const options = useMemo(() => field.options || [], [field.options]);

  if (field.type === "hidden") {
    return null;
  }

  return (
    <label
      className={field.fullWidth ? "block md:col-span-2" : "block"}
      htmlFor={id}
      data-field-name={field.name}
    >
      <span className="mb-1.5 block text-sm font-semibold text-zinc-800">
        {field.label}
        {field.required && <span className="text-rose-600"> *</span>}
      </span>

      {field.type === "textarea" && (
        <textarea
          id={id}
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          className={textareaClass}
          required={field.required}
          rows={field.rows || 5}
        />
      )}

      {field.type === "json-string" && (
        <textarea
          id={id}
          value={typeof value === "string" ? value : (field.defaultJson ?? "")}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder || '{"blocks":[]}'}
          className={`${textareaClass} font-mono`}
          rows={field.rows || 8}
        />
      )}

      {field.type === "block-content" && (
        <BlockBuilder
          value={value}
          onChange={(json) => onChange(field.name, json)}
          folder={field.folder}
        />
      )}

      {field.type === "news-block-content" && (
        <div className="flex flex-col gap-3">
          <BlockBuilder
            value={value}
            onChange={(json) => onChange(field.name, json)}
            folder={field.folder}
          />
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Xem trước
            </span>
            <div className="border border-zinc-200 px-6 py-6 bg-[#F9F8F8]">
              <BlockRenderer
                value={value}
                className="font-montserrat text-[#383838] text-[16px] leading-[26px] flex flex-col gap-6"
              />
            </div>
          </div>
        </div>
      )}

      {field.type === "category-block-content" && (
        <div className="flex flex-col gap-3">
          <BlockBuilder
            value={value}
            onChange={(json) => onChange(field.name, json)}
            folder={field.folder}
            registry={categoryBlockRegistry}
          />
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Xem trước
            </span>
            <div className="border border-zinc-200 px-4">
              <CategoryDetailContent detailContent={value} />
            </div>
          </div>
        </div>
      )}

      {field.type === "select" && (
        <select
          id={id}
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClass}
          required={field.required}
        >
          <option value="">Chọn...</option>
          {options.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
      )}

      {field.type === "searchable-select" && (
        <SearchableSelect
          value={value}
          onChange={(next) => onChange(field.name, next)}
          options={field.options}
          loadOptions={field.loadOptions}
          placeholder={field.placeholder}
        />
      )}

      {field.type === "boolean" && (
        <div className="flex h-11 items-center border border-zinc-300 px-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(field.name, event.target.checked)}
            className="h-4 w-4 accent-zinc-950"
          />
          <span className="ml-2 text-sm text-zinc-700">{field.helper || "Bật"}</span>
        </div>
      )}

      {field.type === "media" && (
        <ImageField
          value={value}
          onChange={(url) => onChange(field.name, url)}
          folder={field.folder}
        />
      )}

      {(field.type === "date" || field.type === "datetime") && (
        <DatePicker
          value={value}
          onChange={(next) => onChange(field.name, next)}
          variant={field.type}
        />
      )}

      {(!field.type || ["text", "number", "money", "email", "url"].includes(field.type)) && (
        <input
          id={id}
          type={field.type === "number" || field.type === "money" ? "number" : field.type || "text"}
          value={value ?? ""}
          onChange={(event) => {
            const nextValue =
              field.type === "number" || field.type === "money"
                ? event.target.value === ""
                  ? ""
                  : Number(event.target.value)
                : event.target.value;
            onChange(field.name, nextValue);
          }}
          placeholder={field.placeholder}
          className={inputClass}
          required={field.required}
          min={field.min}
          disabled={field.readOnly}
        />
      )}

      {field.description && (
        <span className="mt-1.5 block text-xs leading-5 text-zinc-500">{field.description}</span>
      )}
      {error && <span className="mt-1.5 block text-xs font-semibold text-rose-600">{error}</span>}
    </label>
  );
}
