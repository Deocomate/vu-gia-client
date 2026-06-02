import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[16px]"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-[14px] font-medium hover:bg-opacity-90 transition-all">
        Tìm kiếm
      </button>
    </div>
  );
}
