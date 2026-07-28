"use client";

import { useState } from "react";
import { Check, Copy, ImageOff } from "lucide-react";
import ImageUploader from "@/shared/components/admin/inputs/image-uploader";

/**
 * Backend has no media-library GET — this is an upload-only utility that
 * returns MinIO URLs to copy into other forms (products, categories, etc.).
 */
export default function AdminMediaPage() {
  const [urls, setUrls] = useState([]);
  const [copied, setCopied] = useState("");
  const [failedUrls, setFailedUrls] = useState(() => new Set());

  const copy = async (url) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <div className="mb-4 border border-zinc-200 bg-white p-5">
        <h1 className="text-2xl font-semibold text-zinc-950">Tải ảnh lên</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Không có thư viện media dùng chung ở backend — tải ảnh lên đây rồi copy URL để dán vào
          các biểu mẫu (sản phẩm, danh mục, banner...).
        </p>
      </div>

      <div className="border border-zinc-200 bg-white p-5">
        <ImageUploader value={urls} onChange={setUrls} folder="misc" />
      </div>

      {urls.length > 0 && (
        <div className="mt-4 grid gap-3 border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          {urls.map((url) => (
            <div key={url} className="border border-zinc-200 p-2">
              {failedUrls.has(url) ? (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-rose-50 text-center text-[11px] font-semibold text-rose-600">
                  <ImageOff className="h-5 w-5" aria-hidden="true" />
                  Ảnh không hiển thị được
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt=""
                  className="aspect-square w-full object-cover"
                  onError={() => setFailedUrls((current) => new Set(current).add(url))}
                />
              )}
              <button
                type="button"
                onClick={() => copy(url)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 border border-zinc-200 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                {copied === url ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied === url ? "Đã copy" : "Copy URL"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
