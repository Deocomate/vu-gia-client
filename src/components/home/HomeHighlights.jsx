export default function HomeHighlights() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Banner: Sản phẩm nổi bật
        </div>
        <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Banner: Vật phẩm Phong thuỷ
        </div>
      </div>
    </section>
  );
}
