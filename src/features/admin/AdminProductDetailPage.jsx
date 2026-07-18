"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import FormField from "@/components/admin/FormField";
import SeoFields from "@/components/admin/SeoFields";
import SearchableSelect from "@/components/admin/inputs/SearchableSelect";
import { ImageField } from "@/components/admin/inputs/ImageUploader";
import ProductGalleryManager from "@/features/admin/products/ProductGalleryManager";
import ComboBuilder from "@/features/admin/products/ComboBuilder";
import { adminApi, AdminApiError } from "@/lib/adminApi";
import { PRODUCT_TYPE, PRODUCT_TYPE_LABEL, PRODUCT_STATUS, PRODUCT_STATUS_LABEL } from "@/lib/apiEnums";
import { makeAsyncOptions } from "@/features/admin/adminResources";
import { ROUTES } from "@/utils/routes";
import { toast } from "@/utils/feedback";

const loadCategoryOptions = makeAsyncOptions("/product-categories", { searchParam: "name" });

const EMPTY_FORM = {
  name: "",
  slug: "",
  sku: "",
  type: "SINGLE",
  productCategoryId: "",
  price: "",
  compareAtPrice: "",
  priority: 0,
  isFeatured: false,
  status: "DRAFT",
  thumb: "",
  description: "",
  comboProducts: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

// RT-F3: exact backend field names — no categoryId/shortDescription; soldCount is read-only.
function buildPayload(form, { partial }) {
  const payload = {};
  Object.entries(form).forEach(([key, value]) => {
    if (partial && (value === "" || value === undefined)) return;
    if (!partial && value === "" && !["name", "thumb", "type", "price", "productCategoryId"].includes(key)) return;
    payload[key] = value;
  });
  ["price", "compareAtPrice", "priority", "productCategoryId"].forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== "") payload[key] = Number(payload[key]);
  });
  return payload;
}

export default function AdminProductDetailPage({ productId }) {
  const isCreate = productId === "new";
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const load = useCallback(async () => {
    if (isCreate) return;
    setLoading(true);
    setError("");
    try {
      const product = await adminApi.get(`/products/${productId}`);
      setForm({
        ...EMPTY_FORM,
        ...product,
        productCategoryId: product.category?.id ?? product.productCategoryId ?? "",
      });
      setImages((product.images || []).sort((a, b) => a.priority - b.priority));
    } catch (requestError) {
      setError(requestError.message || "Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [isCreate, productId]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaving(true);

    try {
      if (isCreate) {
        const payload = {
          ...buildPayload(form, { partial: false }),
          images: images.map((image, index) => ({ url: image.url, priority: index })),
        };
        const created = await adminApi.post("/products", payload);
        toast.success("Đã tạo sản phẩm.");
        window.location.assign(`${ROUTES.ADMIN_PRODUCTS}/${created.id}`);
        return;
      }

      const payload = buildPayload(form, { partial: true });
      delete payload.soldCount;
      await adminApi.put(`/products/${productId}`, payload);
      toast.success("Đã cập nhật sản phẩm.");
      await load();
    } catch (requestError) {
      if (requestError instanceof AdminApiError && requestError.code === 4001 && requestError.data) {
        setFieldErrors(requestError.data);
      }
      setError(requestError.message || "Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-8">Đang tải sản phẩm...</div>;
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
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            {isCreate ? "Tạo sản phẩm mới" : form.name}
          </h1>
        </div>
        {!isCreate && (
          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-5">
        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Thông tin cơ bản</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField field={{ name: "name", label: "Tên sản phẩm", required: true }} value={form.name} onChange={setField} error={fieldErrors.name} />
            <FormField field={{ name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên" }} value={form.slug} onChange={setField} error={fieldErrors.slug} />
            <FormField field={{ name: "sku", label: "SKU" }} value={form.sku} onChange={setField} error={fieldErrors.sku} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-zinc-800">Danh mục<span className="text-rose-600"> *</span></span>
              <SearchableSelect value={form.productCategoryId} onChange={(v) => setField("productCategoryId", v)} loadOptions={loadCategoryOptions} placeholder="Chọn danh mục" />
              {fieldErrors.productCategoryId && <span className="mt-1.5 block text-xs font-semibold text-rose-600">{fieldErrors.productCategoryId}</span>}
            </label>
            <FormField field={{ name: "type", label: "Loại sản phẩm", type: "select", required: true, options: PRODUCT_TYPE.map((v) => ({ value: v, label: PRODUCT_TYPE_LABEL[v] })) }} value={form.type} onChange={setField} />
            <FormField field={{ name: "status", label: "Trạng thái", type: "select", options: PRODUCT_STATUS.map((v) => ({ value: v, label: PRODUCT_STATUS_LABEL[v] })) }} value={form.status} onChange={setField} />
            <FormField field={{ name: "price", label: "Giá bán", type: "money", required: true, min: 0 }} value={form.price} onChange={setField} error={fieldErrors.price} />
            <FormField field={{ name: "compareAtPrice", label: "Giá gốc", type: "money", min: 0 }} value={form.compareAtPrice} onChange={setField} />
            <FormField field={{ name: "priority", label: "Thứ tự ưu tiên", type: "number" }} value={form.priority} onChange={setField} />
            <FormField field={{ name: "isFeatured", label: "Nổi bật", type: "boolean" }} value={form.isFeatured} onChange={setField} />
            {!isCreate && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-zinc-800">Đã bán</span>
                <input value={form.soldCount ?? 0} disabled className="h-11 w-full border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500" />
              </label>
            )}
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Ảnh đại diện</h2>
          <ImageField value={form.thumb} onChange={(url) => setField("thumb", url)} folder="products" />
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Mô tả chi tiết</h2>
          <FormField field={{ name: "description", label: "", type: "block-content", folder: "products" }} value={form.description} onChange={setField} />
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Gallery</h2>
          {isCreate ? (
            <ProductGalleryManager
              mode="create"
              images={images}
              onChange={setImages}
              onSetThumb={(image) => setField("thumb", image.url)}
            />
          ) : (
            <ProductGalleryManager
              mode="edit"
              productId={productId}
              images={images}
              onChange={setImages}
              onSetThumb={(image) => setField("thumb", image.url)}
            />
          )}
        </section>

        {form.type === "COMBO" && (
          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Combo</h2>
            <ComboBuilder value={form.comboProducts} onChange={(v) => setField("comboProducts", v)} />
          </section>
        )}

        <SeoFields values={form} onChange={setField} />

        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
          <button type="submit" disabled={saving} className="h-11 bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60">
            {saving ? "Đang lưu..." : isCreate ? "Tạo sản phẩm" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
