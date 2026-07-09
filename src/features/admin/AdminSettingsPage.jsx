"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import { adminApi, adminRequest, normalizeCollection } from "@/lib/adminApi";

const valueToString = (value) => {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value ?? {}, null, 2);
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ key: "", value: "{}" });
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get("/settings");
      setSettings(normalizeCollection(payload).items);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const parsedValue = form.value.trim() ? JSON.parse(form.value) : {};
      await adminRequest(`/admin/settings/${form.key}`, {
        method: "PUT",
        body: { value: parsedValue },
      });
      setNotice("Đã lưu setting.");
      setForm({ key: "", value: "{}" });
      await load();
    } catch (requestError) {
      setError(
        requestError instanceof SyntaxError
          ? "JSON không hợp lệ."
          : requestError.message || "Không thể lưu setting.",
      );
    }
  };

  const remove = async () => {
    if (!confirm) {
      return;
    }
    setError("");
    try {
      await adminApi.delete(`/admin/settings/${confirm.key}`);
      setConfirm(null);
      setNotice("Đã xóa setting.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể xóa setting.");
    }
  };

  return (
    <div>
      <div className="mb-5 border border-zinc-200 bg-white p-5">
        <h1 className="text-2xl font-semibold text-zinc-950">Site Settings</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Quản lý key/value JSON cho hotline, Zalo, social, SEO mặc định và feature flags.
        </p>
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

      <form onSubmit={save} className="mb-5 grid gap-4 border border-zinc-200 bg-white p-5 lg:grid-cols-[280px_1fr_auto]">
        <input
          value={form.key}
          onChange={(event) => setForm((current) => ({ ...current, key: event.target.value }))}
          placeholder="setting key"
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          required
        />
        <textarea
          value={form.value}
          onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
          className="min-h-[110px] border border-zinc-300 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-950"
          required
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white lg:self-start"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Upsert
        </button>
      </form>

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8">Đang tải settings...</div>
      ) : (
        <DataTable
          columns={[
            { label: "Key", accessor: "key" },
            {
              label: "Value",
              key: "value",
              render: (_, row) => (
                <code className="line-clamp-2 whitespace-pre-wrap text-xs text-zinc-700">
                  {valueToString(row.value)}
                </code>
              ),
            },
            { label: "Updated", accessor: "updatedAt", type: "date" },
          ]}
          rows={settings}
          onEdit={(row) => setForm({ key: row.key, value: valueToString(row.value) })}
          actions={[
            {
              label: "Delete",
              onClick: (row) => setConfirm(row),
              icon: Trash2,
            },
          ]}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Xóa setting"
        description="Bạn muốn xóa key/value setting này?"
        destructive
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}
