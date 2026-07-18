"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import NewsCard from "@/components/shared/NewsCard";
import BlockRenderer from "@/components/blocks/BlockRenderer";

import craft1 from "@/assets/images/home/HomeCraftsmanship-1.png";
import craft2 from "@/assets/images/home/HomeCraftsmanship-2.png";

const RELATED_ARTICLES = [
  {
    id: 1,
    image: craft1,
    category: "Cẩm nang làng nghề",
    title: "Ý nghĩa chữ Thọ tròn mà bạn cần nên biết",
    description: "How do you create compelling presentations that wow your colleagues and impress your managers?",
    slug: "y-nghia-chu-tho-tron-trong-tam-linh-viet",
  },
  {
    id: 2,
    image: craft2,
    category: "Kiến thức sản phẩm",
    title: "Ý nghĩa chữ Thọ tròn mà bạn cần nên biết",
    description: "How do you create compelling presentations that wow your colleagues and impress your managers?",
    slug: "phan-biet-men-ran-co-va-men-lam",
  },
];

export default function NewsDetailContent({ article, des }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="w-full font-montserrat text-[#383838] leading-[26px] text-[16px] flex flex-col gap-6">
      <BlockRenderer value={des} className="flex flex-col gap-6" />

      {/* Share Section */}
      <div className="flex flex-col gap-[10px] mt-8">
            {/* Top Divider (Mobile Only) */}
            <div className="h-[1px] bg-[#E1DEDE] w-full mb-4 lg:hidden"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-inter leading-[24px]">
              {/* Label (Inter, Semibold, 16px, leading-24, color #667085) */}
              <span className="text-[16px] font-semibold text-[#667085] font-inter leading-[24px]">
                Chia sẻ bài viết
              </span>

              {/* Share Buttons Grid */}
              <div className="flex items-center gap-[10px]">
                {/* Copy Link Button (Inter, Medium, 14px, leading-20, color #344054) */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center h-[40px] pl-[14px] pr-[16px] border border-[#E1DEDE] rounded-[8px] bg-white text-[#344054] hover:bg-[#F9F8F8] transition-all text-[14px] font-medium font-inter leading-[20px] shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <div className="flex items-center gap-[8px]">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Đã copy!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-[8px]">
                      <Image
                        src="/icons/icon-copy-link.png"
                        alt="Copy link"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      <span>Copy link</span>
                    </div>
                  )}
                </button>

                {/* Twitter Share */}
                <a
                  href="https://twitter.com/share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[40px] h-[40px] flex items-center justify-center border border-[#E1DEDE] rounded-[8px] bg-white hover:bg-[#F9F8F8] transition-all"
                  aria-label="Share on Twitter"
                >
                  <Image
                    src="/icons/icon-twitter.png"
                    alt="Twitter"
                    width={16}
                    height={16}
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </a>

                {/* Facebook Share */}
                <a
                  href="https://facebook.com/sharer/sharer.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[40px] h-[40px] flex items-center justify-center border border-[#E1DEDE] rounded-[8px] bg-white hover:bg-[#F9F8F8] transition-all"
                  aria-label="Share on Facebook"
                >
                  <Image
                    src="/icons/icon-facebook.png"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </a>

                {/* LinkedIn Share */}
                <a
                  href="https://linkedin.com/shareArticle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[40px] h-[40px] flex items-center justify-center border border-[#E1DEDE] rounded-[8px] bg-white hover:bg-[#F9F8F8] transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Image
                    src="/icons/icon-linkedin.png"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            </div>

            {/* Bottom Divider (Desktop Only) */}
            <div className="h-[1px] bg-[#E1DEDE] w-full mt-[10px] hidden lg:block"></div>

            {/* RELATED ARTICLES SECTION (Mobile Only) */}
            <div className="mt-8 flex flex-col gap-6 lg:hidden">
              <h3 className="text-[20px] font-bold text-[#97400C] uppercase font-montserrat text-center md:text-left">
                Bài viết liên quan
              </h3>
              
              <div className="flex md:grid md:grid-cols-2 gap-[20px] overflow-x-auto md:overflow-x-visible no-scrollbar pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+62px)] mx-[-31px] px-[31px] scroll-px-[31px] md:w-auto md:mx-0 md:px-0">
                {RELATED_ARTICLES.map((art) => (
                  <div key={art.id} className="flex-shrink-0 w-[252px] md:w-auto snap-start">
                    <NewsCard
                      image={art.image}
                      category={art.category}
                      title={art.title}
                      description={art.description}
                      slug={art.slug}
                      hasTwoLineTitle={true}
                    />
                  </div>
                ))}
              </div>
            </div>
      </div>
    </article>
  );
}

