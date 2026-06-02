import React from "react";
import Image from "next/image";
import craft1 from "@/assets/images/home/HomeCraftsmanship-1.png";
import craft2 from "@/assets/images/home/HomeCraftsmanship-2.png";
import craft3 from "@/assets/images/home/HomeCraftsmanship-3.png";

const HomeCraftsmanship = () => {
  return (
    <section className="relative w-full bg-[#FCF8F5] overflow-hidden font-montserrat">
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
        {/* ================= TIÊU ĐỀ ================= */}
        <h2 className="text-primary text-[32px] lg:text-[40px] font-[800] uppercase leading-[40px] mt-[68px] mb-[50px] text-center break-words">
          Nghệ thuật chế tác
        </h2>

        {/* ================= KHUNG HÌNH ẢNH ================= */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-[24px] w-full max-w-[1334px]">
          <div className="relative w-full lg:w-[438px] h-[300px] lg:h-[424px]">
            <Image
              src={craft1}
              alt="Xưởng gốm"
              fill
              className="object-cover bg-[#D9D9D9]"
              sizes="(max-width: 1024px) 100vw, 438px"
            />
          </div>
          <div className="relative w-full lg:w-[424px] h-[300px] lg:h-[424px]">
            <Image
              src={craft2}
              alt="Giá phơi gốm"
              fill
              className="object-cover bg-[#D9D9D9]"
              sizes="(max-width: 1024px) 100vw, 424px"
            />
          </div>
          <div className="relative w-full lg:w-[424px] h-[300px] lg:h-[424px]">
            <Image
              src={craft3}
              alt="Nghệ nhân làm gốm"
              fill
              className="object-cover bg-[#D9D9D9]"
              sizes="(max-width: 1024px) 100vw, 424px"
            />
          </div>
        </div>

        {/* ================= NỘI DUNG VĂN BẢN ================= */}
        <div className="max-w-[888px] w-full mt-[57px] text-center text-primary italic tracking-[0.40px] flex flex-col gap-[34px]">
          <p className="text-[18px] lg:text-[20px] font-[400] leading-[34px] break-words">
            Tại Gốm Vũ Gia, di sản không đứng yên. Nó được đánh thức bằng đôi
            tay thủ công, bằng những lớp men, nét cọ và tư duy thẩm mỹ của hiện
            tại.
          </p>
          <p className="text-[18px] lg:text-[20px] font-[800] leading-[34px] break-words">
            Chậm, chính xác, và đầy cảm xúc
          </p>
          <p className="text-[18px] lg:text-[20px] font-[400] leading-[34px] break-words">
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
    </section>
  );
};

export default HomeCraftsmanship;
