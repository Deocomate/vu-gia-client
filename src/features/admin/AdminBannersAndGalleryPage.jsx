"use client";

import { useState } from "react";
import TabBar from "@/shared/components/admin/tab-bar";
import AdminResourcePage from "@/features/admin/AdminResourcePage";

const TABS = [
  { key: "banners", label: "Banner" },
  { key: "galleryImages", label: "Thư viện ảnh" },
];

export default function AdminBannersAndGalleryPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  return (
    <div>
      <TabBar tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
      {activeTab === "banners" ? (
        <AdminResourcePage resourceKey="banners" />
      ) : (
        <AdminResourcePage resourceKey="galleryImages" />
      )}
    </div>
  );
}
