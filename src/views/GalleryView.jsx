"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

// Import local assets
import heroBg from "@/assets/images/about/hero-bg.png";
import image1 from "@/assets/images/home/HomeCraftsmanship-2.png"; // shelves of ceramics
import image2 from "@/assets/images/about/about-image-1.png";
import image3 from "@/assets/images/about/about-image-2.png";
import image4 from "@/assets/images/about/about-image-3.png";
import image5 from "@/assets/images/home/HomeCraftsmanship-1.png";
import image6 from "@/assets/images/home/HomeCraftsmanship-3.png";

const GALLERY_IMAGES = [
  { src: image1, alt: "Kệ phơi sản phẩm gốm mộc tại xưởng chế tác" },
  {
    src: image2,
    alt: "Các chi tiết ấm chén trà được nghệ nhân tạo hình hoàn thiện",
  },
  {
    src: image3,
    alt: "Nghệ nhân gốm khéo léo tạo dáng bình trên bàn xoay truyền thống",
  },
  { src: image4, alt: "Hàng gốm mộc xếp đều tăm tắp chờ công đoạn tráng men" },
  {
    src: image5,
    alt: "Các tác phẩm bình phong thủy men rạn độc bản hoàn thiện",
  },
  {
    src: image6,
    alt: "Đôi tay nghệ nhân chăm chút nét vẽ trên xương đất gốm sứ",
  },
];

export default function GalleryView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [fade, setFade] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Responsive thumbnail visible count detection
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // Synchronize thumbnail start index when active index shifts outside view window
  useEffect(() => {
    setThumbnailStartIndex((prev) => {
      if (activeIndex < prev) {
        return activeIndex;
      }
      if (activeIndex >= prev + visibleCount) {
        return activeIndex - visibleCount + 1;
      }
      return prev;
    });
  }, [activeIndex, visibleCount]);

  // Main image fade transition logic
  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => setFade(true), 150);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const currentImage = GALLERY_IMAGES[activeIndex];

  return (
    <div className="w-full min-h-screen bg-[#FAF7F7] overflow-hidden">
      {/* ================= HERO BANNER ================= */}
      <section className="relative w-full h-[320px] md:h-[350px] overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <Image
          src={heroBg}
          alt="Gốm Sứ Vũ Gia Thưởng Lãm"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Dark Screen Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Breadcrumb Text */}
        <div className="relative z-20 text-center px-4">
          <nav className="text-white text-[20px] md:text-[24px] font-inter font-bold uppercase tracking-wider leading-[16px] flex items-center justify-center gap-2">
            <Link
              href={ROUTES.HOME}
              className="hover:text-primary transition-colors duration-300"
            >
              Trang chủ
            </Link>
            <span className="opacity-60 select-none">/</span>
            <span className="opacity-80">Thưởng lãm</span>
          </nav>
        </div>
      </section>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <section className="w-full bg-[#FAF7F7] pt-[89px] pb-[99px] font-montserrat">
        <div className="max-w-[1470px] mx-auto px-[20px] md:px-[60px] lg:px-[80px]">
          {/* Section Heading */}
          <h2 className="text-primary text-[28px] md:text-[32px] font-montserrat font-[700] uppercase leading-[40px] mb-[50px] text-left tracking-wide">
            Hình ảnh của khách hàng
          </h2>

          {/* Large Main Display Image */}
          <div
            className="relative w-full aspect-[16/10] overflow-hidden group cursor-pointer bg-neutral-100 shadow-sm border border-neutral-200 rounded-[2px]"
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* The Active Image */}
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.01] ${
                fade ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 1470px) 100vw, 1410px"
              priority
            />

            {/* Hover magnifying glass state */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <div className="bg-black/60 rounded-full p-4 text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
                  />
                </svg>
              </div>
            </div>

            {/* Subtle Gradient Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-8 z-10 text-white flex flex-col justify-end pointer-events-none">
              <span className="text-[12px] md:text-[14px] font-[600] tracking-wider uppercase opacity-80 mb-2">
                Ảnh thực tế • {activeIndex + 1} / {GALLERY_IMAGES.length}
              </span>
              <h3 className="text-lg md:text-2xl font-[700] tracking-normal leading-snug drop-shadow-sm">
                {currentImage.alt}
              </h3>
            </div>
          </div>

          {/* Spacing Gap */}
          <div className="h-[60px]" />

          {/* Slider Controls & Thumbnail Carousel */}
          <div className="relative w-full select-none">
            {/* Left Shift Button */}
            <button
              onClick={handlePrev}
              className="absolute left-[-15px] md:left-[-48px] lg:left-[-64px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full border border-neutral-300 flex items-center justify-center bg-white hover:bg-neutral-50 active:scale-95 transition-all text-neutral-600 hover:text-primary hover:border-primary z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Carousel Viewport */}
            <div className="w-full overflow-hidden py-1">
              <div
                className="flex transition-transform duration-500 ease-out gap-[24px]"
                style={{
                  transform: `translateX(calc(-${thumbnailStartIndex} * (100% + 24px) / ${visibleCount}))`,
                }}
              >
                {GALLERY_IMAGES.map((img, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] shrink-0 select-none cursor-pointer overflow-hidden rounded-[2px]"
                      style={{
                        width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`,
                      }}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1470px) 25vw, 350px"
                      />

                      {/* Active indicator & overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-300 ${
                          isActive
                            ? "bg-black/0 ring-4 ring-primary ring-inset"
                            : "bg-black/45 hover:bg-black/25"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Shift Button */}
            <button
              onClick={handleNext}
              className="absolute right-[-15px] md:right-[-48px] lg:right-[-64px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full border border-neutral-300 flex items-center justify-center bg-white hover:bg-neutral-50 active:scale-95 transition-all text-neutral-600 hover:text-primary hover:border-primary z-10 cursor-pointer"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center select-none animate-fade-in">
          {/* Close Backdrop Click Area */}
          <div
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          />

          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-3 text-3xl z-20 bg-black/20 hover:bg-black/40 rounded-full"
            aria-label="Close Lightbox"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Left Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 z-20 bg-black/20 hover:bg-black/40 rounded-full"
            aria-label="Previous Image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Active Image container */}
          <div className="relative max-w-[90%] max-h-[80vh] aspect-[16/10] w-full md:w-[80vw] z-10 flex items-center justify-center">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className={`object-contain transition-all duration-300 ${
                fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              sizes="90vw"
            />
          </div>

          {/* Modal Right Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 z-20 bg-black/20 hover:bg-black/40 rounded-full"
            aria-label="Next Image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Info Details Footer in Modal */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/90 z-20 px-6 max-w-[800px] mx-auto select-none pointer-events-none">
            <p className="text-[14px] font-semibold text-primary/80 uppercase tracking-widest mb-1">
              Ảnh {activeIndex + 1} / {GALLERY_IMAGES.length}
            </p>
            <h4 className="text-[16px] md:text-xl font-bold font-montserrat">
              {currentImage.alt}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}
