import React from "react";
import Image from "next/image";
// Import ảnh thumbnail từ thư mục src
import videoThumb from "@/assets/images/home/video-thumb.png";

const HomeVideoProcess = () => {
  return (
    <section className="w-full flex flex-col items-center overflow-hidden bg-white">
      {/* Tiêu đề */}
      <h2 className="mt-[78px] mb-[70px] text-center text-[#97400C] font-['Montserrat'] text-[40px] font-extrabold uppercase leading-[40px]">
        Quy trình sản xuất
      </h2>

      {/* Container chứa video/thumbnail */}
      {/* Container bắt buộc phải có thuộc tính 'relative' để Image dùng thuộc tính 'fill' bên trong */}
      <div className="relative w-full max-w-[1470px] h-[747px] mx-auto">
        {/* Ảnh nền Thumbnail (Sử dụng next/image) */}
        <Image
          src={videoThumb}
          alt="Quy trình sản xuất thumbnail"
          fill // Tự động lấp đầy container cha có position relative
          className="object-cover"
          sizes="(max-width: 1470px) 100vw, 1470px" // Giúp Next.js tối ưu việc load ảnh theo màn hình
          priority // Vì đây là ảnh to, thêm priority để Nextjs ưu tiên tải ngay không lazy-load
        />

        {/* Lớp phủ màu đen 40% (Tương đương với linear-gradient trong HTML) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        {/* Nút Play */}
        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[108px] h-[108px] hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer z-10"
          aria-label="Xem video quy trình sản xuất"
        >
          {/* Nút play được gọi từ thư mục public (Sử dụng next/image) */}
          {/* Với ảnh từ public (string), bạn cần cung cấp width và height rõ ràng */}
          <Image
            src="/images/home/video-play-button.png"
            alt="Play icon"
            width={108}
            height={108}
            className="object-contain"
          />
        </button>
      </div>
    </section>
  );
};

export default HomeVideoProcess;
