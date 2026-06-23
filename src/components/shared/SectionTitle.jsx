import Image from "next/image";

export default function SectionTitle({ title, mobileTitle }) {
  const displayMobileTitle = mobileTitle || (title === "BỘ ĐỒ THỜ TRUYỀN THỐNG" ? "BỘ ĐỒ THỜ" : title);

  return (
    <div className="flex flex-col items-center justify-center text-center pb-[15px] lg:pb-[30px]">
      {/* Tiêu đề cho Desktop */}
      <h2 className="hidden lg:block uppercase text-primary font-montserrat font-[800] text-[40px] leading-tight">
        {title}
      </h2>

      {/* Tiêu đề cho Mobile */}
      <h2 className="lg:hidden uppercase text-primary font-montserrat font-[800] text-[24px] leading-tight px-[10px]">
        {displayMobileTitle}
      </h2>

      {/* Họa tiết trang trí - Chỉ hiển thị trên Desktop */}
      <div className="hidden lg:flex items-center gap-4 mt-2">
        <div className="flex items-center justify-center">
          <Image
            src="/images/home/below-product-list-heading-pattern.png"
            alt="Trang trí"
            width={172}
            height={39}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
