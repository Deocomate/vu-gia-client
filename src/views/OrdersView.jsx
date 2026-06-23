"use client";

import React, { useState } from "react";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import OrderStatusTabs from "@/components/orders/OrderStatusTabs";
import OrderCard from "@/components/orders/OrderCard";
import OrderPagination from "@/components/orders/OrderPagination";
import { ROUTES } from "@/utils/routes";

// Import order images from local assets
import imgDonHang1 from "@/assets/images/don-hang/don-hang-1.png";
import imgDonHang2 from "@/assets/images/don-hang/don-hang-2.png";

export default function OrdersView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Trạng thái đơn hàng", href: null },
  ];

  // Detailed mock orders dataset to fulfill 10 total orders and 3 pages matching the mockup
  const [orders, setOrders] = useState([
    {
      id: "123456789",
      status: "processing",
      date: "11/03/2026 - 12:55",
      totalAmount: 40000000,
      items: [
        {
          id: 1,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang1,
        },
        {
          id: 2,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang2,
        },
      ],
    },
    {
      id: "123456780",
      status: "shipping",
      date: "11/03/2026 - 12:55",
      totalAmount: 40000000,
      items: [
        {
          id: 1,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang1,
        },
        {
          id: 2,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang2,
        },
      ],
    },
    {
      id: "123456781",
      status: "completed",
      date: "11/03/2026 - 12:55",
      totalAmount: 40000000,
      items: [
        {
          id: 1,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang1,
        },
        {
          id: 2,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang2,
        },
      ],
    },
    {
      id: "123456782",
      status: "completed",
      date: "10/03/2026 - 15:30",
      totalAmount: 40000000,
      items: [
        {
          id: 1,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang1,
        },
        {
          id: 2,
          title: "Ngói âm dương nâu đen",
          sku: "46345",
          classification: "Nâu đen",
          quantity: 100,
          price: 20000000,
          originalPrice: 20000000,
          image: imgDonHang2,
        },
      ],
    },
    {
      id: "123456783",
      status: "completed",
      date: "09/03/2026 - 09:15",
      totalAmount: 15000000,
      items: [
        {
          id: 3,
          title: "Bình phong thủy hoa văn cổ",
          sku: "88712",
          classification: "Gốm nung đỏ",
          quantity: 1,
          price: 15000000,
          originalPrice: 16500000,
          image: "/images/products/product-category-thumb.png",
        },
      ],
    },
    {
      id: "123456784",
      status: "cancelled",
      date: "08/03/2026 - 14:20",
      totalAmount: 25000000,
      items: [
        {
          id: 4,
          title: "Bộ đồ thờ cúng đắp nổi Rồng Chầu",
          sku: "99120",
          classification: "Men rạn cổ",
          quantity: 1,
          price: 25000000,
          originalPrice: 25000000,
          image: "/images/products/product-new-thumb.png",
        },
      ],
    },
    {
      id: "123456785",
      status: "completed",
      date: "07/03/2026 - 11:10",
      totalAmount: 36000000,
      items: [
        {
          id: 5,
          title: "Lục bình gốm sứ hoa mai đắp nổi",
          sku: "77123",
          classification: "Men lam",
          quantity: 2,
          price: 18000000,
          originalPrice: 18000000,
          image: "/images/products/product-content-image-thumb.png",
        },
      ],
    },
    {
      id: "123456786",
      status: "completed",
      date: "06/03/2026 - 16:45",
      totalAmount: 5000000,
      items: [
        {
          id: 6,
          title: "Chén trà men ngọc cao cấp Bát Tràng",
          sku: "55432",
          classification: "Men ngọc thanh",
          quantity: 50,
          price: 100000,
          originalPrice: 120000,
          image: "/images/products/product-image-thumb.png",
        },
      ],
    },
    {
      id: "123456787",
      status: "completed",
      date: "05/03/2026 - 10:00",
      totalAmount: 8500000,
      items: [
        {
          id: 7,
          title: "Bình gốm sứ men hỏa biến dáng tỏi",
          sku: "33214",
          classification: "Hỏa biến nâu vàng",
          quantity: 1,
          price: 8500000,
          originalPrice: 8500000,
          image: "/images/products/product-category-thumb.png",
        },
      ],
    },
    {
      id: "123456788",
      status: "returned",
      date: "04/03/2026 - 08:30",
      totalAmount: 3000000,
      items: [
        {
          id: 8,
          title: "Bát đĩa vẽ tay hoa mai xanh Bát Tràng",
          sku: "22109",
          classification: "Sứ vẽ tay",
          quantity: 20,
          price: 150000,
          originalPrice: 150000,
          image: "/images/products/product-new-thumb.png",
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate dynamic tab badge counts based on entire dataset
  const calculateCounts = () => {
    const counts = {
      all: orders.length,
      unpaid: 0,
      processing: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
      returned: 0,
    };

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  const counts = calculateCounts();

  // Filters orders based on current selected tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  // Paginates the filtered orders list
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // reset to first page when changing tabs
  };

  const handleCancelOrder = (orderId) => {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
      alert(`Đã gửi yêu cầu hủy đơn hàng #${orderId} thành công.`);
    }
  };

  const handleContactSupport = (orderId) => {
    alert(`Kết nối với bộ phận chăm sóc khách hàng cho đơn hàng #${orderId}.`);
  };

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-6">
        Trạng thái đơn hàng
      </h1>

      {/* Sub Title */}
      <h2 className="font-montserrat text-[#2E2F2A] text-[18px] font-[600] mb-4">
        Đơn hàng của tôi
      </h2>

      {/* Status Tabs Filter */}
      <OrderStatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
      />

      {/* Order Cards Container */}
      <div className="flex flex-col mt-4 min-h-[300px]">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancelOrder={handleCancelOrder}
              onContactSupport={handleContactSupport}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center font-montserrat">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8C8C8C"
              strokeWidth="1.5"
              className="mb-3"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[#8C8C8C] text-[15px]">
              Không tìm thấy đơn hàng nào ở trạng thái này.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </CustomerServiceLayout>
  );
}
