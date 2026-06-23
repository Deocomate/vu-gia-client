import React from "react";
import Image from "next/image";
import videoThumb from "@/assets/images/home/video-thumb.png";

export default function AboutProcessStats() {
  const stats = [
    { value: "100%", label: "sản xuất thủ công" },
    { value: "2000m2", label: "Diện tích nhà xưởng" },
    { value: "100", label: "Mẫu mã do nghệ nhân chế tác" },
    { value: "35", label: "Năm kinh nghiệm" },
  ];

  return (
    <section className="relative w-full h-[650px] md:h-[800px] lg:h-[996px] overflow-hidden flex flex-col justify-center items-center">
      {/* Background Image */}
      <Image
        src={videoThumb}
        alt="Quy trình sản xuất và nhà xưởng Gốm Vũ Gia"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Dark Overlay (40% as per Figma context) */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1470px] mx-auto px-[20px] lg:px-[30px] flex flex-col justify-between h-full py-[60px] lg:py-[100px]">
        {/* Empty spacer to push content down or balance the layout */}
        <div className="hidden lg:block h-[10%]"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[30px] gap-y-[40px] lg:gap-[81px] w-full text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-[8px]"
            >
              <span className="text-white text-[44px] md:text-[54px] lg:text-[64px] font-inter font-[700] leading-none tracking-tight">
                {stat.value}
              </span>
              <span className="text-white text-[14px] md:text-[16px] lg:text-[18px] font-inter font-[700] leading-[1.3] max-w-[200px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Process Header / Title Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-[24px] lg:gap-[70px] border-t border-white/20 pt-[40px] lg:pt-[60px] w-full max-w-[1200px] mx-auto mt-[40px] lg:mt-0">
          {/* White Logo Container */}
          <div className="relative w-[130px] h-[76px] lg:w-[179.55px] lg:h-[105.30px] shrink-0">
            <Image
              src="/images/footer/footer-logo.png"
              alt="Gốm Sứ Vũ Gia Logo Icon"
              fill
              className="object-contain"
            />
          </div>

          {/* Title Text */}
          <h2 className="text-white text-[24px] md:text-[34px] lg:text-[43.20px] font-inter font-[700] uppercase leading-[1.3] lg:leading-[54px] text-center md:text-left tracking-wide">
            Quy trình sản xuất tại gốm vũ gia
          </h2>
        </div>
      </div>
    </section>
  );
}
