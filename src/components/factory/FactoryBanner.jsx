import React from "react";
import Image from "next/image";
import bannerImg from "@/assets/images/nha-xuong/banner.png";

export default function FactoryBanner() {
  return (
    <section className="relative w-full h-[180px] md:h-[251px] bg-neutral-100 overflow-hidden flex items-center justify-center">
      <Image
        src={bannerImg}
        alt="Nhà xưởng Gốm Sứ Vũ Gia"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </section>
  );
}
