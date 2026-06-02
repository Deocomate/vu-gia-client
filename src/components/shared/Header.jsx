// src/components/shared/Header.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";

const NAV_LINKS = [
  { name: "Trang chủ", href: ROUTES.HOME },
  { name: "Về chúng tôi", href: ROUTES.ABOUT },
  { name: "Sản phẩm", href: ROUTES.PRODUCTS },
  { name: "Thưởng lãm", href: ROUTES.GALLERY },
  { name: "Tin tức", href: ROUTES.NEWS },
  { name: "Liên hệ", href: ROUTES.CONTACT },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative w-full md:py-[10px] bg-primary z-50">
      {/* Container Desktop & Mobile Top Bar */}
      <div className="max-w-[1470px] mx-auto w-full h-[60px] lg:h-[100px] px-[20px] lg:px-[30px] flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden w-[24px] h-[24px] relative flex-shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Image
            src={
              isMobileMenuOpen
                ? "/images/header/close-icon.png"
                : "/images/header/hamburger-menu-icon.png"
            }
            alt="Menu"
            fill
            className="object-contain"
          />
        </button>

        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="relative w-[80px] lg:w-[125px] h-full lg:h-full flex-shrink-0"
        >
          <Image
            src="/images/header/logo.png"
            alt="Gốm Sứ Vũ Gia"
            fill
            className="object-contain object-center lg:object-left"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[63px]">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white text-[18px] font-montserrat font-[700] uppercase leading-[24px] transition-colors hover:text-[#EABA96] ${
                  isActive ? "text-[#EABA96]" : ""
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons (Search, User, Cart) */}
        <div className="flex items-center gap-[20px] lg:gap-[30px]">
          <button
            aria-label="Tìm kiếm"
            className="relative w-[20px] h-[20px] lg:w-[18.9px] lg:h-[18.9px] flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/header/search-icon.png"
              alt="Search"
              fill
              className="object-contain"
            />
          </button>

          <Link
            href={ROUTES.ACCOUNT}
            aria-label="Tài khoản"
            className="hidden lg:block relative w-[20px] h-[20px] flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/header/user.png"
              alt="User"
              fill
              className="object-contain"
            />
          </Link>

          <Link
            href={ROUTES.CART}
            aria-label="Giỏ hàng"
            className="relative w-[24px] h-[24px] flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/header/cart-icon.png"
              alt="Cart"
              fill
              className="object-contain"
            />
            {/* Cart Badge */}
            <div className="absolute top-[1px] left-[12px] min-w-[10px] h-[10px] bg-[#FFE600] rounded-full flex items-center justify-center px-[2px]">
              <span className="text-[#AD5036] font-circular font-[400] text-[6px] leading-none text-center">
                12
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-primary flex flex-col lg:hidden border-t border-white/20 shadow-lg z-40">
          <nav className="flex flex-col py-[10px]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-[20px] py-[15px] text-white text-[16px] font-montserrat font-[600] uppercase border-b border-white/10 last:border-b-0 ${
                    isActive ? "text-[#EABA96] bg-white/5" : "hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href={ROUTES.ACCOUNT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-[20px] py-[15px] text-white text-[16px] font-montserrat font-[600] uppercase hover:bg-white/5 flex items-center gap-[10px]"
            >
              <div className="relative w-[20px] h-[20px]">
                <Image
                  src="/images/header/user.png"
                  alt="User"
                  fill
                  className="object-contain"
                />
              </div>
              Tài khoản
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
