"use client";

import { useState } from "react";
import TabBar from "@/shared/components/admin/tab-bar";
import AdminResourcePage from "@/features/admin/AdminResourcePage";

const TABS = [
  { key: "pages", label: "Trang CMS" },
  { key: "faqs", label: "FAQ" },
];

export default function AdminPagesAndFaqPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  return (
    <div>
      <TabBar tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
      {activeTab === "pages" ? <AdminResourcePage resourceKey="pages" /> : <AdminResourcePage resourceKey="faqs" />}
    </div>
  );
}
