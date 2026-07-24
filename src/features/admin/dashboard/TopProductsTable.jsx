import DataTable from "@/shared/components/admin/data-table";

export default function TopProductsTable({ items, limit, onLimitChange }) {
  return (
    <section className="border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-950">Top sản phẩm bán chạy</h2>
        <select
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          className="h-9 border border-zinc-300 px-2 text-sm outline-none focus:border-zinc-950"
        >
          {[10, 20, 50].map((value) => (
            <option key={value} value={value}>Top {value}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <DataTable
          columns={[
            { key: "productName", label: "Sản phẩm", accessor: "productName" },
            { key: "totalQuantity", label: "Đã bán", accessor: "totalQuantity" },
            { key: "totalRevenue", label: "Doanh thu", accessor: "totalRevenue", type: "money" },
          ]}
          rows={items || []}
        />
      </div>
    </section>
  );
}
