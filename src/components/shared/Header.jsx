// src/components/shared/Header.jsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ROUTES } from "@/shared/utils/routes";
import { useCartStore } from "@/shared/stores/cartStore";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";

/**
 * Builds nav links, wiring the "Sản phẩm" submenu to real `ProductCategory`
 * rows (fetched server-side in `layout.js` and passed down as a prop, since
 * this component is a client component and cannot fetch itself).
 */
function buildNavLinks(categories) {
  const productChildren = categories.length
    ? categories.map((category) => ({
        name: category.name,
        href: `${ROUTES.PRODUCTS}?category=${category.slug}`,
      }))
    : [{ name: "Danh sách sản phẩm", href: ROUTES.PRODUCTS }];

  return [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Về chúng tôi", href: ROUTES.ABOUT },
    { name: "Sản phẩm", href: ROUTES.PRODUCTS, children: productChildren },
    { name: "Thưởng lãm", href: ROUTES.GALLERY },
    { name: "Tin tức", href: ROUTES.NEWS },
    { name: "Liên hệ", href: ROUTES.CONTACT },
  ];
}

function CartLink({ className = "", onClick }) {
  const [mounted, setMounted] = useState(false);
  const totalCount = useCartStore((s) => s.totalCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalCount : 0;

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
        sizes="24px"
      />
      {count > 0 && (
        <div className="absolute top-[-4px] right-[-6px] min-w-[14px] h-[14px] bg-[#FFE600] rounded-full flex items-center justify-center px-[3px]">
          <span className="text-[#AD5036] font-circular font-[700] text-[8px] leading-none text-center">
            {count}
          </span>
        </div>
      )}
    </Link>
  );
}

/**
 * Auth-aware account entry: links to login when logged out, or shows the
 * account link + a small logout dropdown when a customer session is active.
 * Bootstraps `loadCurrentUser()` once on mount (mirrors `RequireCustomerAuth`)
 * so the header reflects an existing session on page load without forcing
 * every public page to redirect through a guard.
 */
function AccountMenu({ className = "" }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const status = useCustomerAuthStore((s) => s.status);
  const user = useCustomerAuthStore((s) => s.user);
  const loadCurrentUser = useCustomerAuthStore((s) => s.loadCurrentUser);
  const logout = useCustomerAuthStore((s) => s.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "idle") {
      loadCurrentUser();
    }
  }, [mounted, status, loadCurrentUser]);

  const isLoggedIn = mounted && status === "authenticated" && !!user;

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push(ROUTES.HOME);
  };

  if (!isLoggedIn) {
    return (
      <Link
        href={ROUTES.LOGIN}
        aria-label="Đăng nhập"
        className={`relative w-[20px] h-[20px] shrink-0 hover:opacity-80 transition-opacity ${className}`}
      >
        <Image src="/images/header/user.png" alt="User" fill className="object-contain" sizes="20px" />
      </Link>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        aria-label="Tài khoản"
        aria-expanded={menuOpen}
        className="relative w-[20px] h-[20px] shrink-0 hover:opacity-80 transition-opacity"
      >
        <Image src="/images/header/user.png" alt="User" fill className="object-contain" sizes="20px" />
      </button>

      {menuOpen && (
        <>
          {/* Click-away backdrop */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 min-w-[200px] rounded-[8px] border border-[#E6E8EC] bg-white shadow-lg overflow-hidden z-50">
            <p className="px-4 py-3 text-[13px] font-montserrat font-semibold text-[#383838] border-b border-[#E6E8EC] truncate">
              {user.name || user.username}
            </p>
            <Link
              href={ROUTES.ACCOUNT}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-[14px] font-montserrat text-[#383838] hover:bg-[#F4F5F6] hover:text-[#97400C] transition-colors"
            >
              Tài khoản của tôi
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-[14px] font-montserrat text-[#383838] hover:bg-[#F4F5F6] hover:text-[#97400C] transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ categories = [] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = buildNavLinks(categories);

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
    <header className="sticky top-0 w-full bg-primary z-50">
      {/* Container Desktop & Mobile Top Bar */}
      <div className="relative max-w-[1470px] mx-auto w-full h-[70px] lg:h-[84px] px-[30px] flex items-center justify-between">
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
            sizes="24px"
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
            sizes="(max-width: 1024px) 80px, 120px"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[30px] xl:gap-[60px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.children) {
              return (
                <div key={link.href} className="relative group py-[10px]">
                  <Link
                    href={link.href}
                    className={`text-white text-[17px] font-montserrat font-[700] uppercase leading-[24px] transition-colors hover:text-[#EABA96] ${
                      isActive ? "text-[#EABA96]" : ""
                    }`}
                  >
                    {link.name}
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute left-0 top-full pt-[10px] opacity-0 invisible translate-y-[8px] transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
                    <div className="min-w-[260px] bg-white rounded-[8px] shadow-lg overflow-hidden border border-[#E6E8EC]">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-[20px] py-[12px] text-[#333] text-[14px] font-montserrat font-[600] hover:bg-[#F4F5F6] hover:text-[#AD5036] transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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
              sizes="19px"
            />
          </button>

          <AccountMenu className="hidden lg:block" />

          <CartLink />

          <AccountMenu className="lg:hidden" />
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
              <div className="absolute left-[145px] top-[204px] w-[515px] h-[668px] opacity-20">
                <Image
                  src="/images/bg-pattern/bg-pattern.svg"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="515px"
                  aria-hidden
                />
              </div>
            </div>

            {/* Overlay Top Bar */}
            <div className="relative z-10 h-[70px] pl-[29px] pr-[15px] flex items-center justify-between w-full border-b border-white/10">
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
                  sizes="80px"
                />
              </Link>

              <div className="flex items-center gap-[28px]">
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
                      sizes="18px"
                    />
                  </button>

                  <CartLink onClick={closeMobileMenu} />
                </div>

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
                    sizes="24px"
                  />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="relative z-10 flex flex-col gap-[30px] pt-[76px] px-[29px]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.children) {
                  return (
                    <div key={link.href} className="flex flex-col gap-[16px]">
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`text-[16px] font-montserrat font-semibold uppercase transition-colors ${
                          isActive ? "text-[#EABA96]" : "text-white hover:text-[#EABA96]"
                        }`}
                      >
                        {link.name}
                      </Link>
                      <div className="flex flex-col gap-[14px] pl-[16px] border-l border-white/20">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={closeMobileMenu}
                            className="text-[14px] font-montserrat font-medium text-white/80 hover:text-[#EABA96] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

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
