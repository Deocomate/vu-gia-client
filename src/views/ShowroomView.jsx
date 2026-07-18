import React from "react";
import ShowroomBanner from "@/components/showroom/ShowroomBanner";
import ShowroomGallery from "@/components/showroom/ShowroomGallery";

// Real `Showroom` entity list rendering (name/address/phone/openingHours/
// mapEmbedUrl). Renders one info+map block per showroom instead of the old
// single hardcoded intro/map pair, since the backend may seed 1..N locations.
function ShowroomEntry({ showroom }) {
  return (
    <section className="w-full pt-[42px] lg:pt-[100px] font-archivo">
      <div className="max-w-[1470px] mx-auto px-[30px]">
        {/* Title */}
        <h2 className="font-arima text-[#2E2F2A] text-[30px] lg:text-[48px] font-[500] leading-tight mb-[18.5px] tracking-wide">
          {showroom.name || "Showroom"}
        </h2>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-[#2E2F2A]/10 mb-[45px] lg:mb-[57px]" />

        {/* Details Table */}
        <div className="grid grid-rows-2 gap-[18px] lg:gap-[24px] text-[#2E2F2A] mb-[40px] lg:mb-[57px]">
          {showroom.address && (
            <div className="flex flex-row items-start">
              <span className="text-[15px] lg:text-[16px] font-[500] uppercase tracking-wider leading-[30px] lg:leading-[40px] w-[130px] flex-shrink-0">
                Địa chỉ
              </span>
              <span className="text-[15px] lg:text-[16px] font-bold leading-[26px] lg:leading-[40px] min-w-0 break-words">
                {showroom.address}
              </span>
            </div>
          )}

          {showroom.phone && (
            <div className="flex flex-row items-start">
              <span className="text-[15px] lg:text-[16px] font-[500] uppercase tracking-wider leading-[30px] lg:leading-[40px] w-[130px] flex-shrink-0">
                Điện thoại
              </span>
              <span className="text-[15px] lg:text-[16px] font-bold leading-[26px] lg:leading-[40px]">
                {showroom.phone}
              </span>
            </div>
          )}

          {showroom.openingHours && (
            <div className="flex flex-row items-start">
              <span className="text-[15px] lg:text-[16px] font-[500] uppercase tracking-wider leading-[30px] lg:leading-[40px] w-[130px] flex-shrink-0">
                Giờ mở cửa
              </span>
              <span className="text-[15px] lg:text-[16px] font-bold leading-[26px] lg:leading-[40px]">
                {showroom.openingHours}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-[18px] w-full mb-10">
          {showroom.phone && (
            <a
              href={`tel:${showroom.phone.replace(/\s+/g, "")}`}
              className="w-full md:w-[362px] h-[76px] bg-gradient-to-r from-[#E79735] to-[#C76E00] hover:from-[#C76E00] hover:to-[#A65C00] text-white flex items-center justify-center gap-[10px] shadow-sm transition-all duration-300 active:scale-[0.98] select-none rounded-[2px]"
            >
              <span className="text-[13px] font-[800] uppercase tracking-widest leading-none">
                Liên hệ ngay
              </span>
            </a>
          )}

          {showroom.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(showroom.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-[362px] h-[76px] border-[3px] border-[#C76E00] bg-transparent hover:bg-[#C76E00]/5 text-[#97400C] flex items-center justify-center gap-[10px] transition-all duration-300 active:scale-[0.98] select-none rounded-[2px]"
            >
              <span className="text-[13px] font-[800] uppercase tracking-widest leading-none">
                Đường đi
              </span>
            </a>
          )}
        </div>

        {/* Map Embed */}
        {showroom.mapEmbedUrl && (
          <div className="relative w-full h-[400px] lg:h-[500px] bg-neutral-100 overflow-hidden mb-[60px] lg:mb-[100px]">
            <iframe
              src={showroom.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Bản đồ chỉ đường đến ${showroom.name || "showroom"}`}
              className="w-full h-full grayscale-[15%] contrast-[110%]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default function ShowroomView({ showrooms = [] }) {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Top Header Banner */}
      <ShowroomBanner />

      {showrooms.length > 0 ? (
        showrooms.map((showroom) => (
          <ShowroomEntry key={showroom.id} showroom={showroom} />
        ))
      ) : (
        <div className="max-w-[1470px] mx-auto px-[30px] py-24 text-center text-neutral-500 font-archivo">
          Chưa có thông tin showroom nào được đăng tải.
        </div>
      )}

      {/* Full-width right-overflowing interior showcase carousel (decorative,
          not tied to a specific Showroom entity field) */}
      <ShowroomGallery />
    </div>
  );
}
