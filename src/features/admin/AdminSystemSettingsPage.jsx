"use client";

import { useState } from "react";
import TabBar from "@/shared/components/admin/tab-bar";
import AdminSiteSettingsPage from "@/features/admin/AdminSiteSettingsPage";
import AdminResourcePage from "@/features/admin/AdminResourcePage";

const TABS = [
  { key: "cart", label: "Chế độ giỏ hàng" },
  { key: "redirects", label: "Redirect" },
];

export default function AdminSystemSettingsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  return (
    <div>
      <TabBar tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
      {activeTab === "cart" ? <AdminSiteSettingsPage /> : <AdminResourcePage resourceKey="redirects" />}
    </div>
  );
}
