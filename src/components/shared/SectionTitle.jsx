import Image from "next/image";

export default function SectionTitle({ title }) {
  return (
    <div className="flex flex-col items-center justify-center text-center pb-[30px]">
      {/* Tiêu đề */}
      <h2 className="uppercase text-primary font-montserrat font-[800] text-[32px] lg:text-[40px] leading-tight">
        {title}
      </h2>

      {/* Họa tiết trang trí */}
      <div className="flex items-center gap-4 mt-2">
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
