import React from "react";
import Image from "next/image";
import aboutImg1 from "@/assets/images/about/about-image-1.jpg";
import aboutImg2 from "@/assets/images/about/about-image-2.jpg";

export default function AboutHeritage() {
  return (
    <section className="w-full bg-[#F9F8F8] py-[40px] lg:py-[60px] font-montserrat">
      <div className="max-w-[1470px] mx-auto px-[31px] lg:px-[30px]">
        {/* Section Title */}
        <h2 className="text-center text-[#97400C] text-[24px] lg:text-[32px] font-montserrat font-[700] uppercase leading-[32px] lg:leading-[40px] mb-[30px] lg:mb-[78px]">
          HỘI TỤ TINH HOA <br className="lg:hidden" /> LÀNG NGHỀ
        </h2>

        {/* Alternate Block 1: Left Text, Right Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] lg:gap-[60px] mb-[40px] lg:mb-[100px]">
          {/* Left Text */}
          <div className="w-full lg:max-w-[642px] flex flex-col gap-[20px]">
            <h3 className="text-black text-[16px] lg:text-[24px] font-montserrat font-[600] leading-[38px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h3>
            <p className="text-black text-[16px] font-montserrat font-[400] leading-[26px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a, aliquet tellus aliquam varius feugiat. Blandit et aliquam arcu, arcu urna. Eu sed purus sed sit nec. Purus tellus sagittis commodo condimentum neque, tempor egestas sit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Right Image (No round) */}
          <div className="relative w-full lg:w-[705px] h-[224px] lg:h-[428px] overflow-hidden shrink-0">
            <Image
              src={aboutImg1}
              alt="Artisan painting vase"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 705px"
            />
          </div>
        </div>

        {/* Alternate Block 2: Left Image, Right Text */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-[40px] lg:gap-[60px] mb-[40px] lg:mb-[60px]">
          {/* Left Image (No round) - Bleeds edge-to-edge on mobile */}
          <div className="relative w-[calc(100%+62px)] mx-[-31px] lg:w-[705px] h-[264px] lg:h-[428px] overflow-hidden shrink-0">
            <Image
              src={aboutImg2}
              alt="Ceramic vases collection"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 705px"
            />
          </div>

          {/* Right Text */}
          <div className="w-full lg:max-w-[645px] flex flex-col gap-[20px]">
            <h3 className="text-black text-[16px] lg:text-[24px] font-montserrat font-[600] leading-[38px]">
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
