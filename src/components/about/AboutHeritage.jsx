import React from "react";
import Image from "next/image";
import craftArtisan from "@/assets/images/home/HomeCraftsmanship-3.png";
import craftVases from "@/assets/images/home/HomeCraftsmanship-1.png";

export default function AboutHeritage() {
  return (
    <section className="w-full bg-[#F9F8F8] py-[60px] font-montserrat">
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[30px]">
        {/* Section Title */}
        <h2 className="text-center text-[#97400C] text-[32px] font-montserrat font-[700] uppercase leading-[40px] mb-[78px]">
          HỘI TỤ TINH HOA LÀNG NGHỀ
        </h2>

        {/* Alternate Block 1: Left Text, Right Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] lg:gap-[60px] mb-[100px]">
          {/* Left Text */}
          <div className="w-full lg:max-w-[642px] flex flex-col gap-[20px]">
            <h3 className="text-black text-[24px] font-montserrat font-[600] leading-[38px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h3>
            <p className="text-black text-[16px] font-montserrat font-[400] leading-[26px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Right Image (No round) */}
          <div className="relative w-full lg:w-[705px] h-[300px] lg:h-[428px] overflow-hidden shrink-0">
            <Image
              src={craftArtisan}
              alt="Artisan painting vase"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 705px"
            />
          </div>
        </div>

        {/* Alternate Block 2: Left Image, Right Text */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-[40px] lg:gap-[60px] mb-[60px]">
          {/* Left Image (No round) */}
          <div className="relative w-full lg:w-[705px] h-[300px] lg:h-[428px] overflow-hidden shrink-0">
            <Image
              src={craftVases}
              alt="Ceramic vases collection"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 705px"
            />
          </div>

          {/* Right Text */}
          <div className="w-full lg:max-w-[645px] flex flex-col gap-[20px]">
            <h3 className="text-black text-[24px] font-montserrat font-[600] leading-[38px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h3>
            <p className="text-black text-[16px] font-montserrat font-[400] leading-[26px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        {/* Bottom Full-width text */}
        <div className="w-full max-w-[1438px] mx-auto mt-0">
          <p className="text-black text-[16px] font-montserrat font-[400] leading-[26px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec.
          </p>
        </div>
      </div>
    </section>
  );
}
