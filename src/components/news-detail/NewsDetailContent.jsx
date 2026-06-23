"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import craft1 from "@/assets/images/home/HomeCraftsmanship-1.png";
import craft2 from "@/assets/images/home/HomeCraftsmanship-2.png";
import craft3 from "@/assets/images/home/HomeCraftsmanship-3.png";
import closingThumb from "@/assets/images/home/closing-thumb.png";

export default function NewsDetailContent({
  article,
  showTop = true,
  showBottom = true,
}) {
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
      {/* --- TOP CONTENT SECTION --- */}
      {showTop && (
        <>
          {/* 1. Introduction Paragraph */}
          <p className="font-normal text-[#383838] text-[16px] leading-[26px] text-justify">
            Nhắc đến gốm sứ người ta sẽ nghĩ ngay đến làng gốm hàng nghìn năm Bát Tràng. Làng nghề truyền thống Bát Tràng chính là cái nôi sinh ra các nghệ nhân làm gốm cũng như các sản phẩm gốm đều được thổi hồn mang một nét đẹp riêng biệt của truyền thống. Gốm Bát Tràng nói riêng và làng nghề gốm sứ Bát Tràng nói chung trở thành niềm tự hào của Việt Nam với các sản phẩm gốm được xuất khẩu ra nước ngoài. Thiên nhiên ưu ái cho vùng đất Bát Tràng nguồn đất sét trắng tinh khiết để tạo ra các phôi gốm chất lượng.
          </p>

          {/* 2. Second Introduction Paragraph */}
          <p className="font-normal text-[#383838] text-[16px] leading-[26px] text-justify">
            Qua bàn tay tài hoa và cái tâm của nghệ nhân làm gốm mà trở nên có hồn. Gốm Bát Tràng có rất nhiều các mẫu gốm phục vụ mọi nhu cầu của người tiêu dùng. Từ các sản phẩm gốm sứ gia dụng, đồ thờ Bát Tràng, cho đến các vật phẩm phong thủy gốm sứ hay đồ trang trí bằng gốm sứ. Tất cả đều được trải qua quá trình tôi luyện cẩn thận tỉ mỉ.
          </p>

          {/* 2. Large Image Block (Wide Accent Section, Full Column Width) */}
          <div className="w-full my-4 flex flex-col gap-2">
            <div className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden bg-gray-100">
              <Image
                src={closingThumb}
                alt="Xưởng sản xuất gốm sứ Vũ Gia"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[14px] italic text-[#777E90] text-center">
              Hình 1: Đôi ngũ nghệ nhân tại xưởng sản xuất gốm tâm linh Vũ Gia đang thảo luận thiết kế độc quyền.
            </span>
          </div>

          {/* 3. Heading 2 Section (Inter, Semibold, 24px, 32px leading) */}
          <h2 className="text-[24px] font-semibold text-[#101828] leading-[32px] font-inter mt-4">
            Phân biệt Rồng 4 móng và Rồng 5 móng trên Bát Hương thờ cúng
          </h2>

          <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
            Trong văn hóa tâm linh Việt Nam, hình tượng Rồng chầu mặt nguyệt luôn mang ý nghĩa tối thượng về quyền lực, tài lộc và sự bình an. Tuy nhiên, không phải ai cũng biết cách phân biệt ý nghĩa giữa rồng 4 móng và rồng 5 móng trên các vật phẩm thờ cúng như bát hương.
          </p>

          {/* 4. Sub-sections with Bullet Points */}
          <div className="flex flex-col gap-3 pl-4 border-l-2 border-[#ECDAD1] py-1">
            <p className="font-semibold text-[#97400C]">1. Rồng 5 móng (Ngũ Trảo Kim Long):</p>
            <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
              Rồng 5 móng xưa nay vốn là biểu tượng của Hoàng đế, đại diện cho thiên tử và quyền lực hoàng gia tuyệt đối. Trên các đồ thờ cúng, họa tiết rồng 5 móng thường được đắp nổi tinh xảo, thể hiện sự trang nghiêm tối cao và vị thế đỉnh phong. Ngày nay, các gia đình dòng tộc lớn thường chọn bát hương rồng 5 móng để khẳng định gia thế thịnh vượng.
            </p>

            <p className="font-semibold text-[#97400C] mt-2">2. Rồng 4 móng (Mãng Long):</p>
            <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
              Rồng 4 móng thường được dùng cho các quan lại, hoàng thân quốc thích hoặc đền chùa dân gian. Biểu tượng này mang tính chất gần gũi hơn với đời sống tâm linh của nhân dân, thể hiện sự che chở, bảo hộ và lòng tôn kính hướng về tổ tiên.
            </p>
          </div>
        </>
      )}

      {/* --- BOTTOM CONTENT SECTION --- */}
      {showBottom && (
        <>
          {/* 5. Craftsmanship Multi-image Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="flex flex-col gap-2">
              <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-gray-100">
                <Image
                  src={craft1}
                  alt="Quy trình chế tác vuốt tay"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[13px] italic text-[#777E90]">
                Quy trình tạo hình gốm vuốt tay thủ công từ phôi đất sét Bát Tràng.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-gray-100">
                <Image
                  src={craft2}
                  alt="Nghệ nhân vẽ tay họa tiết rồng"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[13px] italic text-[#777E90]">
                Nghệ nhân vẽ nhũ vàng và họa màu rồng đắp nổi trực tiếp trên cốt gốm.
              </span>
            </div>
          </div>

          <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
            Lựa chọn bát hương rồng 4 móng hay rồng 5 móng còn phụ thuộc vào phong thủy bàn thờ gia tiên và ước nguyện của gia chủ. Cả hai hình tượng đều là kết tinh của nghệ thuật gốm sứ tâm linh Bát Tràng, mang năng lượng phong thủy cát tường dồi dào cho gia đạo.
          </p>

          {/* 6. Quote Row */}
          <blockquote className="bg-[#ECDAD1]/30 border-l-4 border-[#97400C] p-5 my-2 rounded-r-[8px] italic font-medium text-[#97400C]">
            "Mỗi họa tiết rồng ngậm ngọc trên bát hương thờ cúng Vũ Gia đều được các nghệ nhân dồn toàn bộ tâm huyết, vẽ tay tỉ mỉ và nung ở nhiệt độ chuẩn 1300 độ C để tạo ra nước men bóng bẩy, bền bỉ ngàn năm."
          </blockquote>

          <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
            Để chọn được bộ đồ thờ chuẩn phong thủy, quý khách nên chú ý đến kích thước bát hương hài hòa với không gian ban thờ, cũng như màu men tương sinh với bản mệnh gia chủ. Gốm Sứ Vũ Gia tự hào cung cấp các dòng sản phẩm đồ thờ vẽ tay cao cấp độc bản, được bảo hành chất lượng men trọn đời.
          </p>

          {/* 8. Share Section */}
          <div className="flex flex-col gap-[10px] mt-8">
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

            {/* 7. Divider Line (Below Share Row) */}
            <div className="h-[1px] bg-[#E1DEDE] w-full"></div>
          </div>
        </>
      )}
    </article>
  );
}
