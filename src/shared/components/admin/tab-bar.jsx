"use client";

/**
 * Shared tab switcher for admin pages that merge two (or more) related resource views
 * behind one route (see `docs/admin-ui-architecture.md`'s merged-page pattern). Purely
 * controlled — active tab and change handling live in the parent page.
 */
export default function TabBar({ tabs, activeKey, onChange }) {
  return (
    <div className="mb-4 flex gap-2 border-b border-zinc-200 bg-white px-2">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`-mb-px flex h-11 items-center border-b-2 px-3 text-sm font-semibold transition-colors ${
              active
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
