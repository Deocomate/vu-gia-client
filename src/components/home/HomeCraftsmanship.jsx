import React from "react";
import Image from "next/image";
import craft1 from "@/assets/images/home/HomeCraftsmanship-1.png";
import craft2 from "@/assets/images/home/HomeCraftsmanship-2.png";
import craft3 from "@/assets/images/home/HomeCraftsmanship-3.png";

const HomeCraftsmanship = () => {
  return (
    <section className="relative w-full bg-[#FFF6ED] lg:bg-[#FCF8F5] overflow-hidden font-montserrat">
      {/* Background Pattern (Trái) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[250px] h-[80%] hidden lg:block pointer-events-none z-0">
        <Image
          src="/images/home/bg-pattern-left.png"
          alt=""
          fill
          className="object-contain object-left opacity-30"
        />
      </div>

      {/* Background Pattern (Phải) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[250px] h-[80%] hidden lg:block pointer-events-none z-0">
        <Image
          src="/images/home/bg-pattern-right.png"
          alt=""
          fill
          className="object-contain object-right opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-[30px] max-w-[1470px] flex flex-col items-center relative z-10">
        {/* ================= DESKTOP LAYOUT ================= */}
        <div className="hidden lg:flex flex-col items-center w-full">
          {/* ================= TIÊU ĐỀ ================= */}
          <h2 className="text-primary text-[40px] font-[800] uppercase leading-[40px] mt-[68px] mb-[50px] text-center break-words">
            Nghệ thuật chế tác
          </h2>

          {/* ================= KHUNG HÌNH ẢNH ================= */}
          <div className="flex flex-row justify-center items-stretch gap-[24px] w-full max-w-[1334px]">
            <div className="relative w-[438px] h-[424px]">
              <Image
                src={craft1}
                alt="Xưởng gốm"
                fill
                className="object-cover bg-[#D9D9D9]"
                sizes="438px"
              />
            </div>
            <div className="relative w-[424px] h-[424px]">
              <Image
                src={craft2}
                alt="Giá phơi gốm"
                fill
                className="object-cover bg-[#D9D9D9]"
                sizes="424px"
              />
            </div>
            <div className="relative w-[424px] h-[424px]">
              <Image
                src={craft3}
                alt="Nghệ nhân làm gốm"
                fill
                className="object-cover bg-[#D9D9D9]"
                sizes="424px"
              />
            </div>
          </div>

          {/* ================= NỘI DUNG VĂN BẢN ================= */}
          <div className="max-w-[888px] w-full mt-[57px] text-center text-primary italic tracking-[0.40px] flex flex-col gap-[34px]">
            <p className="text-[20px] font-[400] leading-[34px] break-words">
              Tại Gốm Vũ Gia, di sản không đứng yên. Nó được đánh thức bằng đôi
              tay thủ công, bằng những lớp men, nét cọ và tư duy thẩm mỹ của hiện
              tại.
            </p>
            <p className="text-[20px] font-[800] leading-[34px] break-words">
              Chậm, chính xác, và đầy cảm xúc
            </p>
            <p className="text-[20px] font-[400] leading-[34px] break-words">
              Từ kỹ thuật đổ rót thủ công đòi hỏi sự kiểm soát gần như tuyệt đối
              cho đến những đường bút lông mềm mại chuyển từ thanh mảnh sang phóng
              khoáng trong một nhịp tay duy nhất. Mọi công đoạn đều mang dấu ấn
              sắc nét của người nghệ nhân.
            </p>
          </div>

          {/* ================= ICON TRÍCH DẪN ================= */}
          <div className="mt-[41px] mb-[32px] flex items-center justify-center">
            <div className="relative w-[70px] h-[70px]">
              <Image
                src="/images/home/icon-trich-dan.png"
                alt="Icon trích dẫn"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ================= MOBILE LAYOUT ================= */}
        <div className="lg:hidden flex flex-col items-center w-full max-w-[370px] pt-[35px] pb-[35px]">
          {/* Title */}
          <h2 className="text-[#97400C] text-[20px] font-extrabold uppercase leading-[32px] text-center break-words">
            Nghệ thuật chế tác
          </h2>

          {/* Staggered Images Row */}
          <div className="grid grid-cols-3 gap-[5px] w-full mt-[20px]">
            <div className="relative w-full aspect-[120/119] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
              <Image
                src={craft1}
                alt="Xưởng gốm"
                fill
                className="object-cover"
                sizes="(max-width: 430px) 33vw, 120px"
              />
            </div>
            <div className="relative w-full aspect-square shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden translate-y-[10px]">
              <Image
                src={craft2}
                alt="Giá phơi gốm"
                fill
                className="object-cover"
                sizes="(max-width: 430px) 33vw, 119px"
              />
            </div>
            <div className="relative w-full aspect-[121/118] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
              <Image
                src={craft3}
                alt="Nghệ nhân làm gốm"
                fill
                className="object-cover"
                sizes="(max-width: 430px) 33vw, 121px"
              />
            </div>
          </div>

          {/* Description Text */}
          <div className="w-full mt-[38px] text-[14px] leading-[24px] text-justify text-[#2E2F2A] font-normal flex flex-col gap-[16px]">
            <p className="break-words">
              Tại Gốm Vũ Gia, di sản không đứng yên. Nó được đánh thức bằng đôi tay
              thủ công, bằng những lớp men, nét cọ và tư duy thẩm mỹ của hiện tại.
            </p>
            <p className="font-bold break-words">
              Chậm. Chính xác. Và đầy cảm xúc.
            </p>
            <p className="break-words">
              Từ kỹ thuật đổ rót thủ công đòi hỏi sự kiểm soát gần như tuyệt đối cho
              đến những đường bút lông mềm mại chuyển từ thanh mảnh sang phóng khoáng
              trong một nhịp tay duy nhất. Mọi công đoạn đều mang dấu ấn sắc nét của
              người nghệ nhân.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCraftsmanship;
