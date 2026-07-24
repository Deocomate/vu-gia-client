"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import DatePicker from "@/shared/components/admin/inputs/DatePicker";
import { formatVnd } from "@/shared/api/adminApi";

function fillGaps(points, from, to) {
  const byDate = new Map(points.map((point) => [point.date, point]));
  return eachDayOfInterval({ start: parseISO(from), end: parseISO(to) }).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const existing = byDate.get(key);
    return {
      date: key,
      label: format(day, "dd/MM"),
      revenue: existing?.revenue || 0,
      orders: existing?.orders || 0,
    };
  });
}

export default function RevenueChart({ data, from, to, onRangeChange }) {
  const chartData = data && from && to ? fillGaps(data, from, to) : [];

  return (
    <section className="border border-zinc-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-zinc-950">Doanh thu theo ngày</h2>
        <div className="flex items-center gap-2">
          <DatePicker variant="datetime" value={from} onChange={(value) => onRangeChange({ from: value, to })} />
          <span className="text-sm text-zinc-400">-</span>
          <DatePicker variant="datetime" value={to} onChange={(value) => onRangeChange({ from, to: value })} />
        </div>
      </div>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatVnd(value)} width={90} />
            <Tooltip formatter={(value) => formatVnd(value)} />
            <Line type="monotone" dataKey="revenue" stroke="#09090b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
