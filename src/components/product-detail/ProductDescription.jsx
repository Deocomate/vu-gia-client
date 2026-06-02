import React from "react";

export default function ProductDescription() {
  return (
    <div className="w-full py-8 border-t border-[#E6E8EC] mt-8">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[28px] font-[700] leading-[40px] mb-8 uppercase tracking-wide">
        Mô tả sản phẩm
      </h2>

      {/* Narrative paragraphs */}
      <div className="max-w-[1200px] mx-auto font-montserrat text-[16px] lg:text-[18px] text-[#383838] leading-[30px] flex flex-col gap-6 text-justify">
        <p>
          Đồ thờ cúng Bát Tràng vẽ sen men rạn cổ là sự kết hợp hài hòa giữa nét
          vẽ tay mộc mạc và sắc men rạn truyền thống độc bản. Họa tiết hoa sen
          được khắc họa sống động, uyển chuyển, biểu trưng cho sự thanh cao,
          thuần khiết và lòng tôn kính vô hạn hướng về nguồn cội gia tiên.
        </p>
        <p>
          Từng vật phẩm từ bát hương, bát thờ, mâm bồng đến chóe thờ đều trải
          qua quá trình nung luyện nhiệt độ cao nghiêm ngặt trên 1200 độ C. Nhờ
          đó, chất gốm trở nên đanh chắc, có độ bền cơ học cao và giữ màu sắc
          vĩnh cửu theo thời gian. Đây không chỉ là một bộ thờ tự phong thủy mà
          còn là tác phẩm nghệ thuật gốm sứ độc bản đem đến sự ấm cúng, sang
          trọng và trang nghiêm cho không gian thờ tự của mọi gia đình.
        </p>
      </div>
    </div>
  );
}
