import React from "react";
import Image from "next/image";
import detailImg from "@/assets/images/nha-xuong/detail.png";

export default function FactoryDetailImage() {
  return (
    <section className="relative w-full h-[250px] sm:h-[400px] md:h-[587px] bg-neutral-100 overflow-hidden">
      <Image
        src={detailImg}
        alt="Chi tiết mái chùa lợp ngói đỏ Gốm Sứ Vũ Gia"
        fill
        className="object-cover"
        sizes="100vw"
      />
    </section>
  );
}
