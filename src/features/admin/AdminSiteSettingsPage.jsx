"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import ConfirmDialog from "@/shared/components/admin/confirm-dialog";
import { adminApi } from "@/shared/api/admin-api";
import { ROLE } from "@/shared/api/api-enums";
import { useAdminAuthStore } from "@/shared/stores/admin-auth-store";
import { toast } from "@/shared/utils/feedback";

export default function AdminSiteSettingsPage() {
  const currentUser = useAdminAuthStore((state) => state.user);
  const isSuperAdmin = currentUser?.role === ROLE.SUPERADMIN;

  const [cartEnabled, setCartEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get("/site-settings");
      setCartEnabled(Boolean(payload?.cartEnabled));
    } catch (requestError) {
      setError(requestError.message || "Không thể tải cấu hình.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setConfirmOpen(false);
    setSaving(true);
    try {
      const payload = await adminApi.put("/site-settings", { cartEnabled });
      setCartEnabled(Boolean(payload?.cartEnabled ?? cartEnabled));
      toast.success("Đã cập nhật cấu hình.");
    } catch (requestError) {
      toast.error(requestError.message || "Không thể cập nhật cấu hình.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-5 h-16 animate-pulse border border-zinc-200 bg-white" />
        <div className="h-52 animate-pulse border border-zinc-200 bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-zinc-950">Chế độ giỏ hàng</h1>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Bật/tắt giỏ hàng và thanh toán cho toàn bộ trang web.
        </p>
      </div>

      <section className="border border-zinc-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-950">Giỏ hàng &amp; thanh toán</p>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              Khi bật, khách hàng có thể thêm sản phẩm vào giỏ hàng, áp dụng mã giảm giá và thanh
              toán như bình thường. Khi tắt, giỏ hàng và mã giảm giá sẽ ẩn, khách hàng chỉ có thể
              gửi form liên hệ.
            </p>
            {!isSuperAdmin && (
              <p className="mt-2 text-sm font-semibold text-amber-700">
                Chỉ SUPERADMIN có quyền thay đổi.
              </p>
            )}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={cartEnabled}
            aria-label="Bật/tắt giỏ hàng"
            disabled={!isSuperAdmin || saving}
            onClick={() => setCartEnabled((value) => !value)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              cartEnabled ? "bg-zinc-950" : "bg-zinc-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                cartEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {isSuperAdmin && (
          <div className="mt-5 flex justify-end border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={saving}
              className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận thay đổi"
        description="Bạn có chắc muốn tắt/bật giỏ hàng cho toàn bộ trang web?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={save}
      />
    </div>
  );
}
