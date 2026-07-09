"use client";

import { useMemo } from "react";
import MediaPicker from "@/components/admin/MediaPicker";

const inputClass =
  "h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const textareaClass =
  "min-h-[120px] w-full border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

export default function FormField({ field, value, onChange }) {
  const id = `field-${field.name}`;

  const options = useMemo(() => field.options || [], [field.options]);

  if (field.type === "hidden") {
    return null;
  }

  return (
    <label className={field.fullWidth ? "block md:col-span-2" : "block"} htmlFor={id}>
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

      {field.type === "json" && (
        <textarea
          id={id}
          value={
            typeof value === "string"
              ? value
              : value
                ? JSON.stringify(value, null, 2)
                : field.defaultJson || "{}"
          }
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder || '{"type":"content"}'}
          className={`${textareaClass} font-mono`}
          rows={field.rows || 8}
        />
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
        <MediaPicker value={value} onChange={(mediaId) => onChange(field.name, mediaId)} />
      )}

      {field.type === "date" && (
        <input
          id={id}
          type="datetime-local"
          value={value ? String(value).slice(0, 16) : ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClass}
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
        />
      )}

      {field.description && (
        <span className="mt-1.5 block text-xs leading-5 text-zinc-500">{field.description}</span>
      )}
    </label>
  );
}
