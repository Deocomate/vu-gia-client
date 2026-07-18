"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

// Turns a (possibly Vietnamese-diacritic) category label into a stable,
// URL-safe anchor id, e.g. "Vận chuyển & thời gian giao hàng" -> "van-chuyen-thoi-gian-giao-hang".
function slugifyCategory(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Groups the flat `Faq` entity list (already sorted by `sortOrder` from the
// server) into `{ id, title, items }` sections by `category`, preserving
// first-seen category order.
function groupFaqsByCategory(faqs) {
  const order = [];
  const byCategory = new Map();

  faqs.forEach((faq) => {
    const title = faq.category || "Khác";
    if (!byCategory.has(title)) {
      byCategory.set(title, []);
      order.push(title);
    }
    byCategory.get(title).push({ question: faq.question, answer: faq.answer });
  });

  return order.map((title) => ({
    id: slugifyCategory(title),
    title,
    items: byCategory.get(title),
  }));
}

export default function FaqView({ faqs = [] }) {
  const FAQ_DATA = useMemo(() => groupFaqsByCategory(faqs), [faqs]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(FAQ_DATA[0]?.id ?? "");
  const [openItems, setOpenItems] = useState(() => {
    // Default-open the first item of every section, mirroring the previous
    // mock's always-one-expanded UX.
    const initial = {};
    FAQ_DATA.forEach((section) => {
      initial[`${section.id}-0`] = true;
    });
    return initial;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const section of FAQ_DATA) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [FAQ_DATA]);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const filteredData = FAQ_DATA.map((section) => {
    const matchingItems = section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchingItems };
  }).filter((section) => section.items.length > 0);

  return (
    <div className="w-full bg-white">
      {/* Top Banner Section */}
      <section className="relative w-full h-[300px] md:h-[400px] flex items-end justify-center overflow-hidden pb-8 md:pb-12 bg-[#2E2F2A]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://demo.thceramics.vn/storage/assets/images/faq-banner.png"
            alt="FAQ Banner"
            className="w-full h-full object-cover opacity-80"
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 w-[90%] max-w-[735px]">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập nội dung tìm kiếm..."
              className="w-full font-archivo font-extralight h-12 md:h-16 px-6 pl-16 text-base lg:text-lg rounded-full bg-white/20 backdrop-blur-md border-[2px] border-white focus:bg-white/30 focus:outline-none transition-all text-white placeholder:text-white italic shadow-2xl"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-[85%] max-w-[1320px] mx-auto pt-12 pb-16 md:pt-[70px] md:pb-[100px] grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 h-fit">
          <div className="mb-4">
            <h1 className="text-[48px] font-aref-ruqaa text-[#2E2F2A] mb-4 md:mb-6 font-bold leading-[40px]">
              FAQ
            </h1>
            <hr className="border-t border-black/10 w-full mt-12" />
          </div>
          <nav className="flex flex-col gap-3">
            {FAQ_DATA.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(e, section.id)}
                className={`text-[14px] font-archivo font-medium uppercase leading-[40px] tracking-wider transition-colors duration-200 select-none ${
                  activeSection === section.id
                    ? "text-[#C76E00]"
                    : "text-[#2E2F2A] hover:text-[#C76E00]"
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-[16px] text-[14px] font-archivo font-normal leading-[40px] text-[#2E2F2A]/60 mb-[22px] font-medium">
            <Link href={ROUTES.HOME} className="text-[#2E2F2A] hover:underline transition-all">
              Trang chủ
            </Link>
            <svg
              className="w-[10px] h-[20px] text-[#2E2F2A]/60 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-[#2E2F2A]">Câu hỏi thường gặp</span>
          </div>

          {filteredData.length > 0 ? (
            <div className="space-y-12">
              {filteredData.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-28">
                  {/* Category Header */}
                  <div className="flex items-center gap-[12px] pt-4 border-b border-[#2E2F2A]/5 pb-4">
                    <div className="w-[3px] h-8 bg-[#C76E00]"></div>
                    <h2 className="text-[32px] leading-[40px] font-arima font-semibold text-[#2E2F2A]">
                      {section.title}
                    </h2>
                  </div>

                  {/* Accordion List */}
                  <div className="divide-y divide-[#2E2F2A]/10">
                    {section.items.map((item, itemIdx) => {
                      const itemKey = `${section.id}-${itemIdx}`;
                      const isOpen = searchQuery ? true : !!openItems[itemKey];

                      return (
                        <div key={itemKey} className="py-3">
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full flex justify-between items-center text-left gap-4 group focus:outline-none py-3"
                          >
                            <span className="text-[16px] font-arima font-medium leading-[28px] text-[#2E2F2A] group-hover:text-[#C76E00] transition-colors duration-200">
                              {item.question}
                            </span>
                            <span className="flex-shrink-0 text-[#C76E00] transition-transform duration-300">
                              {isOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              )}
                            </span>
                          </button>

                          {/* Accordion Content wrapper with smooth animation */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="pt-2 pb-4 pr-6">
                              <p
                                className="text-[14px] font-archivo font-[200] leading-[25px] text-[#2E2F2A] text-justify"
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#2E2F2A]/60 font-archivo">
              Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
