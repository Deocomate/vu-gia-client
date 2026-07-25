"use client";

import { useRef } from "react";
import { Bold } from "lucide-react";
import { sanitizeInlineHtml } from "@/shared/components/rich-text/sanitize-html";

/**
 * Controlled contentEditable field with inline Bold support only. No
 * third-party rich-text library — `document.execCommand` handles the toggle,
 * the hand-rolled sanitizer normalizes output on every paste/blur so
 * `execCommand`'s DOM quirks never leak into stored/rendered content.
 */
export default function RichTextField({ value, onChange, className = "", placeholder }) {
  const editorRef = useRef(null);

  const handleBold = (event) => {
    event.preventDefault(); // keep the current selection (avoid onMouseDown->blur first)
    editorRef.current?.focus();
    document.execCommand("bold");
  };

  const handleBlur = () => {
    const html = sanitizeInlineHtml(editorRef.current?.innerHTML || "");
    onChange(html);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboard = event.clipboardData;
    const raw = clipboard.getData("text/html") || clipboard.getData("text/plain");
    const sanitized = sanitizeInlineHtml(raw);
    document.execCommand("insertHTML", false, sanitized);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <button
          type="button"
          onMouseDown={handleBold}
          className="flex h-8 w-8 items-center justify-center border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
          aria-label="In đậm"
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        className={`min-h-[60px] border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-950 empty:before:text-zinc-400 empty:before:content-[attr(data-placeholder)] ${className}`}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}
