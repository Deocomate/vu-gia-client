"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminApi, formatVnd } from "@/lib/adminApi";
import { PRODUCT_STATUS } from "@/features/admin/adminResources";
import { ROUTES } from "@/utils/routes";

const childSections = [
  {
    key: "variants",
    title: "Variants",
    path: "variants",
    columns: [
      { label: "Name", accessor: "name" },
      { label: "SKU", accessor: "sku" },
      { label: "Price", accessor: "price", type: "money" },
      { label: "Stock", accessor: "stockQty" },
      { label: "Default", accessor: "isDefault", type: "boolean" },
      { label: "Active", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "sku", label: "SKU", required: true },
      { name: "name", label: "Tên variant", required: true },
      { name: "price", label: "Giá", type: "money", required: true },
      { name: "compareAtPrice", label: "Giá gốc", type: "money" },
      { name: "packSize", label: "Pack size", type: "number" },
      { name: "stockQty", label: "Tồn kho", type: "number" },
      { name: "imageId", label: "Ảnh", type: "media", fullWidth: true },
      { name: "isDefault", label: "Mặc định", type: "boolean" },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
    defaults: { stockQty: 0, sortOrder: 0, isActive: true, isDefault: false },
  },
  {
    key: "images",
    title: "Gallery sản phẩm",
    path: "images",
    columns: [
      { label: "Media", accessor: "mediaId" },
      { label: "Primary", accessor: "isPrimary", type: "boolean" },
      { label: "Thứ tự", accessor: "sortOrder" },
    ],
    fields: [
      { name: "mediaId", label: "Media", type: "media", required: true, fullWidth: true },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isPrimary", label: "Ảnh chính", type: "boolean" },
    ],
    defaults: { sortOrder: 0, isPrimary: false },
  },
  {
    key: "specifications",
    title: "Thông số / công năng",
    path: "specifications",
    columns: [
      { label: "STT", accessor: "sortOrder" },
      { label: "Tên", accessor: "name" },
      { label: "Số lượng", accessor: "quantity" },
      { label: "ĐVT", accessor: "unit" },
    ],
    fields: [
      { name: "sortOrder", label: "STT", type: "number" },
      { name: "name", label: "Tên vật phẩm", required: true },
      { name: "quantity", label: "Số lượng", required: true },
      { name: "unit", label: "ĐVT", required: true },
      { name: "usage", label: "Công dụng", type: "textarea", rows: 4, fullWidth: true, required: true },
    ],
    defaults: { sortOrder: 0 },
  },
  {
    key: "setItems",
    title: "Set items",
    path: "set-items",
    columns: [
      { label: "Tên", accessor: "name" },
      { label: "SKU", accessor: "sku" },
      { label: "Giá", accessor: "price", type: "money" },
      { label: "SL", accessor: "defaultQuantity" },
      { label: "Thứ tự", accessor: "sortOrder" },
    ],
    fields: [
      { name: "componentId", label: "Component product ID" },
      { name: "name", label: "Tên", required: true },
      { name: "sku", label: "SKU" },
      { name: "price", label: "Giá", type: "money", required: true },
      { name: "compareAtPrice", label: "Giá gốc", type: "money" },
      { name: "imageId", label: "Ảnh", type: "media", fullWidth: true },
      { name: "defaultQuantity", label: "Số lượng mặc định", type: "number" },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
    ],
    defaults: { defaultQuantity: 1, sortOrder: 0 },
  },
  {
    key: "relations",
    title: "Sản phẩm liên quan",
    path: "relations",
    createOnly: true,
    columns: [
      { label: "Related ID", accessor: "relatedId" },
      { label: "Type", accessor: "type", type: "status" },
      { label: "Thứ tự", accessor: "sortOrder" },
    ],
    fields: [
      { name: "relatedId", label: "Related product ID", required: true },
      { name: "type", label: "Type", type: "select", options: ["SIMILAR", "CROSS_SELL"], required: true },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
    ],
    defaults: { type: "SIMILAR", sortOrder: 0 },
  },
];

const compactPayload = (fields, form) => {
  const payload = {};
  fields.forEach((field) => {
    const value = form[field.name];
    if (value === "" && !field.required) {
      return;
    }
    payload[field.name] = value;
  });
  return payload;
};

function ChildSection({ productId, section, rows, onReload }) {
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(section.defaults || {});
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditor({ mode: "create" });
    setForm(section.defaults || {});
    setError("");
  };

  const openEdit = (row) => {
    setEditor({ mode: "edit", row });
    setForm({ ...(section.defaults || {}), ...row });
    setError("");
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = compactPayload(section.fields, form);
      if (editor.mode === "edit") {
        await adminApi.patch(
          `/admin/products/${productId}/${section.path}/${editor.row.id}`,
          payload,
        );
      } else {
        await adminApi.post(`/admin/products/${productId}/${section.path}`, payload);
      }
      setEditor(null);
      await onReload();
    } catch (requestError) {
      setError(requestError.message || "Không thể lưu dữ liệu.");
    }
  };

  const remove = async () => {
    if (!confirm) {
      return;
    }
    setError("");
    try {
      await adminApi.delete(`/admin/products/${productId}/${section.path}/${confirm.id}`);
      setConfirm(null);
      await onReload();
    } catch (requestError) {
      setError(requestError.message || "Không thể xóa dữ liệu.");
    }
  };

  return (
    <section className="border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-950">{section.title}</h2>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-9 items-center gap-2 bg-zinc-950 px-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Thêm
        </button>
      </div>
      {error && (
        <div className="mb-3 border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      <DataTable
        columns={section.columns}
        rows={rows || []}
        onEdit={section.createOnly ? undefined : openEdit}
        onDelete={setConfirm}
      />

      {editor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-950/50 px-4 py-8">
          <form onSubmit={save} className="w-full max-w-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-950">{section.title}</h3>
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="inline-flex h-9 w-9 items-center justify-center hover:bg-zinc-100"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={(name, value) =>
                    setForm((current) => ({ ...current, [name]: value }))
                  }
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={() => setEditor(null)}
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
        title={`Xóa ${section.title}`}
        description="Bạn muốn xóa dữ liệu này khỏi sản phẩm?"
        destructive
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </section>
  );
}

export default function AdminProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get(`/admin/products/${productId}`);
      setProduct(payload);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-8">Đang tải sản phẩm...</div>;
  }

  if (error || !product) {
    return (
      <div className="border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        {error || "Không tìm thấy sản phẩm."}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={ROUTES.ADMIN_PRODUCTS}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Sản phẩm
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span>{product.sku}</span>
            <StatusBadge value={product.status} />
            <span>{formatVnd(product.price)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tải lại
        </button>
      </div>

      <div className="grid gap-5">
        {childSections.map((section) => (
          <ChildSection
            key={section.key}
            productId={product.id}
            section={section}
            rows={product[section.key]}
            onReload={load}
          />
        ))}
      </div>
    </div>
  );
}
