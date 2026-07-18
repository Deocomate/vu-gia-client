"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";
import { CalendarDays } from "lucide-react";
import "react-day-picker/style.css";

/**
 * `variant="date"` emits yyyy-MM-dd (date-only fields like dob).
 * `variant="datetime"` emits an ISO instant (startsAt/endsAt/placedFrom...).
 */
export default function DatePicker({ value, onChange, variant = "datetime", disabled }) {
  const [open, setOpen] = useState(false);
  const parsedDate = value ? parseISO(value) : undefined;
  const selected = parsedDate && isValid(parsedDate) ? parsedDate : undefined;
  const [timeValue, setTimeValue] = useState(selected ? format(selected, "HH:mm") : "00:00");

  const emit = (date, time) => {
    if (!date) {
      onChange("");
      return;
    }
    if (variant === "date") {
      onChange(format(date, "yyyy-MM-dd"));
      return;
    }
    const [hours, minutes] = (time || "00:00").split(":").map(Number);
    const next = new Date(date);
    next.setHours(hours || 0, minutes || 0, 0, 0);
    onChange(next.toISOString());
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selected ? "" : "text-zinc-400"}>
          {selected
            ? format(selected, variant === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm")
            : "Chọn ngày"}
        </span>
        <CalendarDays className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 border border-zinc-200 bg-white p-3 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              emit(date, timeValue);
              if (variant === "date") setOpen(false);
            }}
          />
          {variant === "datetime" && (
            <div className="mt-2 flex items-center gap-2 border-t border-zinc-200 pt-2">
              <input
                type="time"
                value={timeValue}
                onChange={(event) => {
                  setTimeValue(event.target.value);
                  if (selected) emit(selected, event.target.value);
                }}
                className="h-9 flex-1 border border-zinc-300 px-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 bg-zinc-950 px-3 text-xs font-semibold text-white"
              >
                Xong
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
