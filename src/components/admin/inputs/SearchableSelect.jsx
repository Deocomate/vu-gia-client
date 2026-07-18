"use client";

import { useCombobox } from "downshift";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

/**
 * Two modes:
 * - static `options` array: [{value, label}]
 * - async `loadOptions(query) => Promise<[{value,label}]>` for FK pickers
 */
export default function SearchableSelect({
  value,
  onChange,
  options,
  loadOptions,
  placeholder = "Tìm kiếm...",
  disabled,
}) {
  const [items, setItems] = useState(options || []);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((item) => String(item.value) === String(value)) || null,
    [items, value],
  );

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    setInputValue,
  } = useCombobox({
    items,
    itemToString: (item) => item?.label || "",
    selectedItem,
    onSelectedItemChange: ({ selectedItem: next }) => {
      onChange(next ? next.value : "");
    },
    onInputValueChange: ({ inputValue: query, type }) => {
      if (!loadOptions) return;
      if (type !== useCombobox.stateChangeTypes.InputChange) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await loadOptions(query);
          setItems(results || []);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
  });

  useEffect(() => {
    if (loadOptions && !inputValue) {
      loadOptions("").then((results) => setItems(results || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (options) setItems(options);
  }, [options]);

  return (
    <div className="relative">
      <div
        className="flex h-11 items-center border border-zinc-300 bg-white focus-within:border-zinc-950"
      >
        <input
          {...getInputProps({
            placeholder: selectedItem ? selectedItem.label : placeholder,
            disabled,
          })}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setInputValue("");
            }}
            className="px-2 text-zinc-400 hover:text-zinc-950"
            aria-label="Bỏ chọn"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <ChevronDown className="mr-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
      </div>
      <ul
        {...getMenuProps()}
        className={`absolute z-30 mt-1 max-h-64 w-full overflow-y-auto border border-zinc-200 bg-white shadow-lg ${
          isOpen && (items.length || loading) ? "block" : "hidden"
        }`}
      >
        {loading && <li className="px-3 py-2 text-sm text-zinc-400">Đang tìm...</li>}
        {!loading && isOpen && items.length === 0 && (
          <li className="px-3 py-2 text-sm text-zinc-400">Không có kết quả</li>
        )}
        {isOpen &&
          items.map((item, index) => (
            <li
              key={item.value}
              {...getItemProps({ item, index })}
              className={`cursor-pointer px-3 py-2 text-sm ${
                highlightedIndex === index ? "bg-zinc-100" : ""
              } ${String(item.value) === String(value) ? "font-semibold text-zinc-950" : "text-zinc-700"}`}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
