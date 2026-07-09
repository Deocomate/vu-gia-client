"use client";

import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Pagination from "@/components/admin/Pagination";
import { adminApi, normalizeCollection } from "@/lib/adminApi";

const PAGE_SIZE = 18;

export default function AdminMediaPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get("/admin/media", {
        search,
        folder,
        page,
        limit: PAGE_SIZE,
      });
      const collection = normalizeCollection(payload);
      setItems(collection.items);
      setTotal(collection.total || collection.items.length);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải media.");
    } finally {
      setLoading(false);
    }
  }, [folder, page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setError("");
    setNotice("");
    try {
      await adminApi.upload("/admin/media/upload", formData);
      setNotice("Đã upload media.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Upload thất bại.");
    } finally {
      event.target.value = "";
    }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await adminApi.patch(`/admin/media/${editing.id}`, {
        alt: editing.alt || undefined,
        title: editing.title || undefined,
        folder: editing.folder || undefined,
      });
      setEditing(null);
      setNotice("Đã cập nhật media.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể cập nhật media.");
    }
  };

  const remove = async () => {
    if (!confirm) {
      return;
    }
    setError("");
    try {
      await adminApi.delete(`/admin/media/${confirm.id}`);
      setConfirm(null);
      setNotice("Đã xóa media.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể xóa media.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">Media Library</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Upload và quản lý MediaAsset dùng chung cho catalog, content và SEO.
          </p>
        </div>
        <label className="inline-flex h-11 cursor-pointer items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload
          <input type="file" className="sr-only" accept="image/*" onChange={upload} />
        </label>
      </div>

      <div className="mb-4 grid gap-3 border border-zinc-200 bg-white p-4 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Tìm media"
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950 md:col-span-2"
        />
        <input
          value={folder}
          onChange={(event) => {
            setPage(1);
            setFolder(event.target.value);
          }}
          placeholder="Folder"
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        />
      </div>

      {notice && (
        <div className="mb-4 border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8 text-sm font-semibold text-zinc-500">
          Đang tải media...
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              {
                label: "Preview",
                key: "preview",
                render: (_, row) =>
                  row.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.url} alt={row.alt || ""} className="h-12 w-12 object-cover" />
                  ) : (
                    "-"
                  ),
              },
              { label: "Title", accessor: "title" },
              { label: "Alt", accessor: "alt" },
              { label: "Folder", accessor: "folder" },
              { label: "Mime", accessor: "mimeType" },
              { label: "Size", accessor: "sizeBytes" },
            ]}
            rows={items}
            onEdit={setEditing}
            onDelete={setConfirm}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
          <form onSubmit={saveEdit} className="w-full max-w-xl border border-zinc-200 bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-zinc-950">Sửa media</h2>
            <div className="mt-4 grid gap-4">
              <FormField
                field={{ name: "title", label: "Title" }}
                value={editing.title}
                onChange={(name, value) => setEditing((current) => ({ ...current, [name]: value }))}
              />
              <FormField
                field={{ name: "alt", label: "Alt text" }}
                value={editing.alt}
                onChange={(name, value) => setEditing((current) => ({ ...current, [name]: value }))}
              />
              <FormField
                field={{ name: "folder", label: "Folder" }}
                value={editing.folder}
                onChange={(name, value) => setEditing((current) => ({ ...current, [name]: value }))}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700"
              >
                Hủy
              </button>
              <button type="submit" className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white">
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Xóa media"
        description="Media đang được tham chiếu có thể không xóa được ở backend."
        destructive
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}
