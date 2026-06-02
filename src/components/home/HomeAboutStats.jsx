export default function HomeAboutStats() {
  const stats = [
    { value: "100%", label: "Gốm Bát Tràng chính hãng" },
    { value: "2000m2", label: "Diện tích xưởng sản xuất" },
    { value: "50+", label: "Nghệ nhân lành nghề" },
    { value: "10k+", label: "Khách hàng tin dùng" },
  ];

  return (
    <section className="bg-neutral-900 text-white py-20 my-[100px]">
      <div className="max-w-[1470px] mx-auto w-full px-[30px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[30px] lg:text-[36px] font-bold mb-6 text-primary uppercase">
              Về Gốm sứ Vũ Gia
            </h2>
            <p className="text-gray-300 text-[16px] leading-relaxed mb-8">
              Kế thừa truyền thống làm gốm lâu đời của làng nghề Bát Tràng, Vũ
              Gia tự hào là đơn vị chuyên sản xuất và phân phối các sản phẩm gốm
              sứ tâm linh, phong thuỷ và trang trí cao cấp. Chúng tôi cam kết
              mang đến những sản phẩm chất lượng nhất, đậm đà bản sắc văn hoá
              Việt.
            </p>
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition-colors text-[16px]">
              Tìm hiểu thêm
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 border border-gray-700 rounded-lg"
              >
                <div className="text-[32px] lg:text-[40px] font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-[14px] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
