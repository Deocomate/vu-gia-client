// src/components/shared/Header.jsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ROUTES } from "@/utils/routes";

const NAV_LINKS = [
  { name: "Trang chủ", href: ROUTES.HOME },
  { name: "Về chúng tôi", href: ROUTES.ABOUT },
  { name: "Sản phẩm", href: ROUTES.PRODUCTS },
  { name: "Thưởng lãm", href: ROUTES.GALLERY },
  { name: "Tin tức", href: ROUTES.NEWS },
  { name: "Liên hệ", href: ROUTES.CONTACT },
];

function CartLink({ className = "", onClick }) {
  return (
    <Link
      href={ROUTES.CART}
      aria-label="Giỏ hàng"
      onClick={onClick}
      className={`relative w-[24px] h-[24px] shrink-0 hover:opacity-80 transition-opacity ${className}`}
    >
      <Image
        src="/images/header/cart-icon.png"
        alt="Cart"
        fill
        className="object-contain"
      />
      <div className="absolute top-[-4px] right-[-6px] min-w-[14px] h-[14px] bg-[#FFE600] rounded-full flex items-center justify-center px-[3px]">
        <span className="text-[#AD5036] font-circular font-[700] text-[8px] leading-none text-center">
          12
        </span>
      </div>
    </Link>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = (event) => {
      if (event.matches) {
        closeMobileMenu();
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <header className="relative w-full bg-primary z-50">
      {/* Container Desktop & Mobile Top Bar */}
      <div className="relative max-w-[1470px] mx-auto w-full h-[70px] lg:h-[84px] px-[20px] lg:px-[30px] flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden w-[24px] h-[24px] relative flex-shrink-0"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Mở menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Image
            src="/images/header/hamburger-menu-icon.png"
            alt="Menu"
            fill
            className="object-contain"
          />
        </button>

        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 w-[80px] lg:w-[120px] h-[40px] lg:h-[54px] shrink-0"
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
        <nav className="hidden lg:flex items-center gap-[30px] xl:gap-[60px]">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white text-[17px] font-montserrat font-[700] uppercase leading-[24px] transition-colors hover:text-[#EABA96] ${
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
            className="hidden lg:block relative w-[18.9px] h-[18.9px] flex-shrink-0 hover:opacity-80 transition-opacity"
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

          <CartLink />
        </div>
      </div>

      {/* Mobile Menu Full-screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-primary z-50 overflow-hidden flex flex-col lg:hidden"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-1/2 top-[204px] -translate-x-1/2 w-[515px] h-[668px] opacity-20 mix-blend-overlay">
                <Image
                  src="/images/header/bg-pattern-mobile.png"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden
                />
              </div>
            </div>

            {/* Overlay Top Bar */}
            <div className="relative z-10 h-[70px] px-[20px] flex items-center justify-between w-full border-b border-white/10">
              <Link
                href={ROUTES.HOME}
                className="relative w-[80px] h-[40px] flex-shrink-0"
                onClick={closeMobileMenu}
              >
                <Image
                  src="/images/header/logo.png"
                  alt="Gốm Sứ Vũ Gia"
                  fill
                  className="object-contain object-left"
                />
              </Link>

              <div className="flex items-center gap-[20px]">
                <button
                  aria-label="Tìm kiếm"
                  className="relative w-[18px] h-[18px] flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/images/header/search-icon.png"
                    alt="Search"
                    fill
                    className="object-contain"
                  />
                </button>

                <CartLink onClick={closeMobileMenu} />

                <button
                  className="relative w-[24px] h-[24px] flex-shrink-0 hover:opacity-80 transition-opacity"
                  onClick={closeMobileMenu}
                  aria-label="Đóng menu"
                >
                  <Image
                    src="/images/header/close-icon.png"
                    alt="Close"
                    fill
                    className="object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="relative z-10 flex flex-col gap-[30px] pt-[76px] px-[29px]">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`text-[16px] font-montserrat font-semibold uppercase transition-colors ${
                      isActive ? "text-[#EABA96]" : "text-white hover:text-[#EABA96]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer Copyright */}
            <div className="relative z-10 mt-auto pb-[40px] px-[29px]">
              <p className="font-inter text-[16px] text-white/80 leading-[24px]">
                © 2026. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
