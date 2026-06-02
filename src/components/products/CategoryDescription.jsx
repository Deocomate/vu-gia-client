import React from "react";

export default function CategoryDescription({ description }) {
  const defaultText = (
    <>
      Nhắc đến gốm sứ người ta sẽ nghĩ ngay đến làng gốm hàng nghìn năm Bát
      Tràng. Làng nghề truyền thống Bát Tràng chính là cái nôi sinh ra các nghệ
      nhân làm gốm cũng như các sản phẩm gốm sứ với chất lượng tối ưu. Tại đây
      các sản phẩm gốm đều được thổi hồn mang một nét đẹp riêng biệt của truyền
      thống. Gốm Bát Tràng nói riêng và làng nghề gốm sứ Bát Tràng nói chung trở
      thành niềm tự hào của Việt Nam với các sản phẩm gốm được xuất khẩu ra nước
      ngoài.
    </>
  );

  return (
    <div className="max-w-[1300px] mx-auto text-center pt-[45px] pb-8 px-4 flex flex-col items-center">
      {/* Main Text */}
      <p className="font-montserrat text-[16px] font-[400] text-[#383838] leading-[28px] break-words">
        {description || defaultText}
      </p>
    </div>
  );
}
