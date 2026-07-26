"use client";

import { useState } from "react";
import AdminResourceManager from "@/features/admin/AdminResourceManager";
import { resources } from "@/features/admin/adminResources";
import Modal from "@/shared/components/admin/modal";
import OrderPaymentPanel from "@/features/admin/orders/OrderPaymentPanel";
import OrderStatusControls from "@/features/admin/orders/OrderStatusControls";

// Orders has no generic PUT/POST/DELETE contract (see `adminResources.js`'s `orders` entry) —
// status/paymentStatus transitions and VietQR payment access reuse the same
// `OrderStatusControls`/`OrderPaymentPanel` components `AdminOrderDetailPage.jsx` renders
// (untouched, internal logic not modified), just hosted in a `Modal` shell and triggered from a
// row action here — the same `rowActions` factory + `openModal`/`closeModal` escape hatch Users
// introduced. `/orders/admin` returns the same `OrderResponse` shape as `/orders/{id}` (confirmed
// against `OrderServiceImpl`), so `row.payment`/`row.status` are already present without an extra
// fetch.

function OrderStatusModal({ order, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);

  return (
    <Modal
      open
      onClose={onClose}
      title={`Cập nhật trạng thái — ${order.orderCode}`}
      size="md"
      preventClose={saving}
    >
      <OrderStatusControls order={order} onUpdated={onSaved} onSavingChange={setSaving} />
    </Modal>
  );
}

function OrderPaymentModal({ order, onClose }) {
  return (
    <Modal open onClose={onClose} title={`Thanh toán VietQR — ${order.orderCode}`} size="md">
      <OrderPaymentPanel payment={order.payment} />
    </Modal>
  );
}

const ordersResource = {
  ...resources.orders,
  rowActions: (row, { reload, openModal, closeModal }) => {
    const actions = [
      {
        label: "Cập nhật trạng thái",
        onClick: () =>
          openModal(
            <OrderStatusModal
              order={row}
              onClose={closeModal}
              onSaved={() => {
                closeModal();
                reload();
              }}
            />,
          ),
      },
    ];

    // Mirrors `AdminOrderDetailPage`'s `{order.payment && <OrderPaymentPanel ... />}` — payment
    // info is only present for unpaid ONL orders (see `OrderResponse.payment` Javadoc).
    if (row.payment) {
      actions.push({
        label: "Thanh toán",
        onClick: () => openModal(<OrderPaymentModal order={row} onClose={closeModal} />),
      });
    }

    return actions;
  },
};

export default function OrdersAdminList() {
  return <AdminResourceManager resource={ordersResource} />;
}
