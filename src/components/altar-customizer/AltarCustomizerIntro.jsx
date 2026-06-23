"use client";

import { useRouter } from "next/navigation";

export default function AltarCustomizerIntro() {
  const router = useRouter();

  return (
    <section className="relative min-h-[206px] text-center px-5 md:px-0">
      <button
        type="button"
        onClick={() => router.back()}
        className="block md:absolute md:right-[42px] md:top-11 ml-auto mb-4 md:mb-0 w-[92px] h-[31px] rounded-[5px] border border-[#ebe5df] bg-white text-[#903f11] text-[14px] font-semibold cursor-pointer"
      >
        Thoát <span className="ml-[5px]">×</span>
      </button>
      <h1 className="m-0 pt-0 md:pt-[62px] text-primary text-[30px] md:text-[40px] leading-[38px] md:leading-[49px] font-bold uppercase">
        Tùy chỉnh bộ đồ thờ
      </h1>
      <p className="mt-5 mx-auto max-w-[1320px] text-black font-inter text-[15px] md:text-[20px] italic leading-[24px] md:leading-[28px]">
        Chọn loại bàn thờ, kích thước và phong cách mong muốn. Bạn có thể thêm vật phẩm, sắp xếp bố cục và gửi yêu cầu về Gốm Vũ Gia
      </p>
    </section>
  );
}
