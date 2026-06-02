import Image from "next/image";
import productImageThumb from "@/assets/images/products/product-image-thumb.png";

export default function ProductCard({
  image = productImageThumb,
  name = "Bình hút lộc\nMã đáo thành công",
  sku = "MSP: VG001",
  originalPrice = "2.500.000đ",
  salePrice = "2.000.000đ",
  soldCount = 12,
  hasTwoLineTitle = false,
}) {
  return (
    <div className="flex flex-col group cursor-pointer border border-[#E6E8EC] rounded-[8px] bg-white overflow-hidden hover:shadow-lg transition-all duration-300 h-full w-full">
      {/* Container Ảnh */}
      <div className="relative w-full aspect-[340/255] bg-[#F4F5F6] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src={image} 
            alt={name.replace('\n', ' ')}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Container Thông tin */}
      <div className="flex flex-col pt-[15px] pb-[18px]">
        {/* Tên sản phẩm */}
        <h3 
          style={{ minHeight: hasTwoLineTitle ? "48px" : "auto" }}
          className="font-montserrat font-[700] text-[18px] lg:text-[20px] leading-[24px] text-[#141416] px-[18px] line-clamp-2 whitespace-pre-line"
        >
          {name}
        </h3>
        
        {/* Mã sản phẩm */}
        <p className="font-montserrat font-[500] text-[14px] leading-[24px] text-[#777E90] px-[18px] mt-2">
          {sku}
        </p>
        
        {/* Đường gạch ngang */}
        <div className="h-[1px] bg-[#E6E8EC] mx-[18px] mt-[16px] mb-[7px]"></div>

        {/* Khối Giá & Đã bán */}
        <div className="flex items-start justify-between px-[18px]">
          <div className="flex flex-col">
            <span className="font-montserrat font-[700] text-primary text-[20px] lg:text-[24px] leading-[32px]">
              {salePrice}
            </span>
            {originalPrice && (
              <span className="font-montserrat font-[400] text-[14px] leading-[24px] text-[#838383] line-through mt-[-2px]">
                {originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-[4px] mt-[10px]">
            {/* Icon Tick xanh */}
            <Image 
              src="/images/home/green-round-check.png"
              alt="Đã bán"
              width={16}
              height={16}
              className="object-contain"
            />
            <span className="font-montserrat font-[700] text-[#67A865] text-[12px] leading-[12px]">
              Đã bán: {soldCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
