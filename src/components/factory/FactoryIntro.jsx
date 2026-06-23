import React from "react";

export default function FactoryIntro() {
  return (
    <section className="w-full flex flex-col pt-[60px] lg:pt-[119px] pb-0 font-montserrat">
      {/* Title */}
      <h1 className="font-arima text-[#101010] text-[40px] lg:text-[64px] font-[500] leading-[44px] lg:leading-[60px] mb-[40px] lg:mb-[72px] break-words">
        Nghệ thuật chế tác
      </h1>

      {/* Content Block */}
      <div className="w-full max-w-[1334px] flex flex-col">
        {/* Subtitle */}
        <h2 className="text-[#101010] text-[18px] lg:text-[20px] font-[600] uppercase leading-[30px] lg:leading-[35px] mb-[10px] break-words">
          Quy mô ấn tượng: 5000m² - 3 tầng vận hành chuyên biệt
        </h2>

        {/* Paragraph Description */}
        <p className="text-[#101010] text-[15px] lg:text-[16px] font-[300] leading-[26px] lg:leading-[28px] max-w-[1240px] break-words">
          Để đáp ứng những đơn hàng lớn cho các công trình trọng điểm như đình chùa, biệt thự hay khu nghỉ dưỡng, Vũ Gia đã đầu tư hệ thống nhà xưởng với tổng diện tích lên đến 5.000m², được thiết kế tối ưu với 3 tầng sản xuất. Việc mở rộng không gian không chỉ khẳng định năng lực cung ứng mạnh mẽ mà còn giúp chúng tôi kiểm soát chất lượng sản phẩm một cách khắt khe nhất. Mỗi tầng đều được quy hoạch bài bản, đảm bảo diện tích lưu kho và khu vực chế tác luôn thông thoáng, đáp ứng mọi tiến độ gấp gáp từ khách hàng.
        </p>
      </div>
    </section>
  );
}
