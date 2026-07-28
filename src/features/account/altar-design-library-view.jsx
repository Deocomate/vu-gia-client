"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CustomerServiceLayout from "@/features/account/components/customer-service-layout";
import AltarDesignCard from "@/features/account/components/altar-design-card";
import OrderPagination from "@/features/orders/components/order-pagination";
import { ROUTES } from "@/shared/utils/routes";
import { confirm, toast } from "@/shared/utils/feedback";
import {
  deleteAltarDesign,
  listAltarDesigns,
  renameAltarDesign,
} from "@/features/storefront/altar-customizer/altar-design-service";

const PAGE_SIZE = 9;

/** "Thư viện thiết kế" account page (phase 5) — grid of the customer's saved altar designs, with
 * open/rename/delete actions and an empty state. Sits under the `(user)` route group, whose
 * layout already gates on `RequireCustomerAuth`, so no auth check is needed here (see
 * `features/account/profile-view.jsx`'s equivalent note). */
export default function AltarDesignLibraryView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Thư viện thiết kế", href: null },
  ];

  const [designs, setDesigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAltarDesigns({ page: currentPage, size: PAGE_SIZE });
      setDesigns(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err?.message || "Không thể tải thư viện thiết kế.");
      setDesigns([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const handleRename = async (design, nextName) => {
    const trimmed = nextName.trim();
    if (!trimmed || trimmed === design.name) return;
    try {
      await renameAltarDesign(design.id, trimmed);
      toast.success("Đã đổi tên thiết kế.");
      setDesigns((prev) => prev.map((item) => (item.id === design.id ? { ...item, name: trimmed } : item)));
    } catch (err) {
      toast.error(err?.message || "Không thể đổi tên thiết kế.");
    }
  };

  const handleDelete = async (design) => {
    const ok = await confirm({
      title: "Xóa thiết kế",
      description: `Bạn có chắc chắn muốn xóa thiết kế "${design.name}"? Hành động này không thể hoàn tác.`,
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      destructive: true,
    });
    if (!ok) return;

    try {
      await deleteAltarDesign(design.id);
      toast.success("Đã xóa thiết kế.");
      if (designs.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        fetchDesigns();
      }
    } catch (err) {
      toast.error(err?.message || "Không thể xóa thiết kế.");
    }
  };

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      <h1 className="font-arima text-[#2E2F2A] text-[30px] md:text-[36px] font-[400] leading-[40px] mb-6">
        Thư viện thiết kế
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12 font-montserrat text-[#8C8C8C] text-[15px]">
          Đang tải thư viện thiết kế...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center font-montserrat">
          <p className="text-[15px] text-[#D92D20]">{error}</p>
          <button
            onClick={fetchDesigns}
            className="cursor-pointer rounded-[6px] bg-[#C76E00] px-5 py-2 text-[14px] font-[700] text-white transition duration-200 hover:bg-[#a65c00]"
          >
            Thử lại
          </button>
        </div>
      ) : designs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <AltarDesignCard
              key={design.id}
              design={design}
              onRename={(nextName) => handleRename(design, nextName)}
              onDelete={() => handleDelete(design)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center font-montserrat">
          <p className="text-[15px] text-[#8C8C8C]">
            Bạn chưa lưu thiết kế nào. Hãy tạo bố cục tại{" "}
            <Link href={ROUTES.ALTAR_CUSTOMIZER} className="text-[#C76E00] hover:underline">
              trang tùy chỉnh bàn thờ
            </Link>{" "}
            và bấm &quot;Lưu&quot; để lưu vào đây.
          </p>
        </div>
      )}

      {!loading && !error && (
        <OrderPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </CustomerServiceLayout>
  );
}
