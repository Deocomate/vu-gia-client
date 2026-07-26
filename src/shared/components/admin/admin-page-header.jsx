"use client";

/**
 * Shared title + toolbar block for admin list/resource pages: a title, optional
 * description, and a slot for primary actions (reload/create/etc buttons or links).
 * Used directly by AdminResourceManager, which every generic-engine list page
 * (including Products, Orders, and Users) renders through — they all get this header
 * transitively. Not used by AdminDashboard/AdminOrderDetailPage, which have
 * structurally different headers (no search/action-button bar).
 */
export default function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="mb-4 flex flex-col gap-3 border border-zinc-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
