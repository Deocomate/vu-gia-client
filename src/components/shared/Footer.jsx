// src/components/shared/Footer.jsx
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function Footer() {
  return (
    <footer className="relative bg-primary overflow-hidden w-full pt-[31px] lg:pt-[65px] font-montserrat z-10 mt-auto">
      {/* Background Patterns (Desktop only) */}
      <div className="absolute left-[-160px] top-[-220px] w-[300px] lg:w-[400px] h-full pointer-events-none z-[-1] hidden lg:block opacity-70">
        <Image
          src="/images/footer/footer-pattern-left.png"
          alt=""
          fill
          className="object-contain object-left-top"
        />
      </div>
      <div className="absolute right-[-160px] top-[175px] w-[300px] lg:w-[400px] h-full pointer-events-none z-[-1] hidden lg:block opacity-70">
        <Image
          src="/images/footer/footer-pattern-right.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
        />
      </div>

      <div className="max-w-[1470px] mx-auto px-[35px] lg:px-[60px]">
        {/* Main Grid: Trái (Logo & Địa chỉ) & Phải (Content + Footer links) */}
        <div className="flex flex-col lg:flex-row justify-between gap-[20px]">
          
          {/* ================= CỘT TRÁI: LOGO & THÔNG TIN ================= */}
          <div className="flex flex-row lg:flex-col justify-between items-start w-full lg:w-[320px] shrink-0 pb-0 lg:pb-[30px]">
            <Link
              href={ROUTES.HOME}
              className="mb-0 lg:mb-[38px] shrink-0"
            >
              <Image
                src="/images/footer/footer-logo.png"
                alt="Gốm Sứ Vũ Gia"
                width={205}
                height={120}
                className="w-[125px] lg:w-[205px] h-auto object-contain"
              />
            </Link>

            {/* Text Title */}
            <div className="hidden lg:flex mb-[30px] items-center">
              <span className="text-[#EAECF0] text-[24px] font-[600] uppercase leading-[24px]">
                Thanh hai
              </span>
              <span className="text-[#EAECF0] text-[24px] font-[600] leading-[24px] ml-[4px]">
                CO., LTD
              </span>
            </div>

            {/* Address List */}
            <ul className="flex flex-col gap-[9px] lg:gap-[15px] text-right lg:text-left mt-[5px] lg:mt-0">
              <li className="flex items-start justify-end lg:justify-start gap-[9px] lg:gap-[15px]">
                <Image
                  src="/images/footer/footer-location-icon.png"
                  alt="Location"
                  width={16}
                  height={16}
                  className="w-[16px] h-[16px] object-contain mt-[4px] lg:mt-[5px] shrink-0 hidden lg:block"
                />
                <span className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[24px] lg:leading-[26px]">
                  18 Giang Cao, Bát Tràng
                </span>
              </li>
              <li className="flex items-start justify-end lg:justify-start gap-[9px] lg:gap-[15px]">
                <Image
                  src="/images/footer/footer-mail-icon.png"
                  alt="Email"
                  width={16}
                  height={16}
                  className="w-[16px] h-[16px] object-contain mt-[4px] lg:mt-[5px] shrink-0 hidden lg:block"
                />
                <span className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[24px] lg:leading-[26px]">
                  gomvugia@gmail.com
                </span>
              </li>
              <li className="flex items-start justify-end lg:justify-start gap-[9px] lg:gap-[15px]">
                <Image
                  src="/images/footer/footer-phone-icon.png"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="w-[16px] h-[16px] object-contain mt-[4px] lg:mt-[5px] shrink-0 hidden lg:block"
                />
                <span className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[24px] lg:leading-[26px]">
                  091 7777 247
                </span>
              </li>
            </ul>
          </div>

          {/* ================= CỘT PHẢI: WRAPPER ================= */}
          <div className="flex flex-col flex-1 w-full lg:min-w-0 mt-[20px] lg:mt-0">
            
            {/* Phía trên của cột phải: Links + Form */}
            <div className="flex flex-col lg:flex-row justify-between gap-[30px] lg:gap-[50px]">
              
              {/* Form Newsletter & Bộ Công Thương */}
              <div className="flex flex-col w-full lg:w-auto shrink-0 items-center lg:items-start order-1 lg:order-2 mb-[10px] lg:mb-0">
                <h3 className="text-[#EAECF0] text-[15px] lg:text-[20px] font-[700] lg:font-[400] leading-[32px] mb-[8px]">
                  Để lại thông tin tư vấn
                </h3>

                <div className="flex items-center gap-[7px] w-full justify-center lg:justify-start mb-[30px] lg:mb-[20px]">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full lg:w-[282px] h-[45px] lg:h-[54px] bg-[#EABA96]/60 rounded-[60px] px-[20px] text-[#97400C] placeholder:text-[#97400C]/70 placeholder:italic lg:placeholder:not-italic outline-none text-[14px] lg:text-[16px] font-normal"
                  />
                  <button className="flex-shrink-0 w-[70px] h-[45px] lg:h-[54px] bg-white/60 rounded-[60px] text-[#97400C] font-[600] text-[16px] lg:text-[20px] flex items-center justify-center hover:bg-white/80 transition-colors">
                    Gửi
                  </button>
                </div>

                {/* Badge Bộ Công Thương (PC) */}
                <div className="hidden lg:block">
                  <Image
                    src="/images/footer/footer-bo-cong-thuong.png"
                    alt="Đã thông báo Bộ Công Thương"
                    width={171}
                    height={52}
                    className="w-[171px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Cột Links */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-[20px] flex-1 order-2 lg:order-1">
                
                {/* Tổng quan */}
                <div className="flex flex-col">
                  <h3 className="text-[#EAECF0] text-[14px] lg:text-[24px] font-[700] lg:font-[600] uppercase lg:capitalize leading-[32px] mb-[10px] lg:mb-[18px]">
                    Tổng quan
                  </h3>
                  <ul className="flex flex-col">
                    <li>
                      <Link href={ROUTES.ABOUT} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Về chúng tôi
                      </Link>
                    </li>
                    <li className="block lg:hidden">
                      <Link href={ROUTES.SHOWROOM} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Showroom
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.FACTORY} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Nhà xưởng
                      </Link>
                    </li>
                    <li className="hidden lg:block">
                      <Link href={ROUTES.GALLERY} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Thưởng lãm
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.CONTACT} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Liên hệ
                      </Link>
                    </li>
                  </ul>
                  {/* Badge BCT (Mobile) */}
                  <div className="block lg:hidden mt-[20px]">
                    <Image
                      src="/images/footer/footer-bo-cong-thuong.png"
                      alt="Đã thông báo Bộ Công Thương"
                      width={171}
                      height={52}
                      className="w-[150px] h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Dịch vụ */}
                <div className="flex flex-col">
                  <h3 className="text-[#EAECF0] text-[14px] lg:text-[24px] font-[700] lg:font-[600] uppercase lg:capitalize leading-[32px] mb-[10px] lg:mb-[18px]">
                    Dịch vụ
                  </h3>
                  <ul className="flex flex-col">
                    <li>
                      <Link href={ROUTES.ACCOUNT} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Tài khoản
                      </Link>
                    </li>
                    <li className="block lg:hidden">
                      <Link href={ROUTES.SHIPPING_POLICY} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Hướng dẫn mua hàng
                      </Link>
                    </li>
                    <li className="hidden lg:block">
                      <Link href={ROUTES.SHIPPING_POLICY} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Chính sách vận chuyển
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.ORDERS} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Tra cứu đơn hàng
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.FAQ} className="text-[#EAECF0] text-[14px] lg:text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Sản phẩm (Chỉ hiện trên PC) */}
                <div className="hidden lg:flex flex-col">
                  <h3 className="text-[#EAECF0] text-[24px] font-[600] leading-[32px] mb-[18px]">
                    Sản phẩm
                  </h3>
                  <ul className="flex flex-col">
                    <li>
                      <Link href={ROUTES.PRODUCTS} className="text-[#EAECF0] text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Bộ đồ thờ
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.PRODUCTS} className="text-[#EAECF0] text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Bình phong thủy
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.PRODUCTS} className="text-[#EAECF0] text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Lục bình gốm sứ
                      </Link>
                    </li>
                    <li>
                      <Link href={ROUTES.PRODUCTS} className="text-[#EAECF0] text-[16px] font-[400] leading-[34px] hover:text-white transition-colors">
                        Khác
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phía dưới của cột phải: Divider & Copyright */}
            <div className="w-full h-[1px] bg-white/20 mt-[33px] lg:mt-[44px] mb-[20px] lg:mb-[30px]"></div>

            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-[15px] lg:gap-0 pb-[30px]">
              <p className="text-[#E0C5B6] lg:text-white text-[11px] lg:text-[14px] font-[400] leading-[26px]">
                Copyright © 2026 . All rights reserved
              </p>
              <div className="flex items-center gap-[10px] lg:gap-[20px] flex-wrap justify-center">
                <Link href={ROUTES.SHIPPING_POLICY} className="text-[#E0C5B6] lg:text-white text-[12px] lg:text-[14px] font-[400] leading-[26px] hover:opacity-80 transition-opacity">
                  Điều khoản dịch vụ
                </Link>
                <span className="font-archivo lg:font-inter text-[#E0C5B6] lg:text-white opacity-60 text-[14px]">
                  |
                </span>
                <Link href={ROUTES.PRIVACY_POLICY} className="text-[#E0C5B6] lg:text-white text-[12px] lg:text-[14px] font-[400] leading-[26px] hover:opacity-80 transition-opacity">
                  Chính sách bảo mật
                </Link>
                <span className="font-archivo lg:font-inter text-[#E0C5B6] lg:text-white opacity-60 text-[14px]">
                  |
                </span>
                <Link href={ROUTES.RETURN_POLICY} className="text-[#E0C5B6] lg:text-white text-[12px] lg:text-[14px] font-[400] leading-[26px] hover:opacity-80 transition-opacity">
                  Quy định chung
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
