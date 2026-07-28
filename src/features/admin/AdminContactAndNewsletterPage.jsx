"use client";

import { useState } from "react";
import TabBar from "@/shared/components/admin/tab-bar";
import AdminResourcePage from "@/features/admin/AdminResourcePage";

const TABS = [
  { key: "contactRequests", label: "Liên hệ" },
  { key: "newsletterSubscribers", label: "Newsletter" },
];

export default function AdminContactAndNewsletterPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  return (
    <div>
      <TabBar tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
      {activeTab === "contactRequests" ? (
        <AdminResourcePage resourceKey="contactRequests" />
      ) : (
        <AdminResourcePage resourceKey="newsletterSubscribers" />
      )}
    </div>
  );
}
