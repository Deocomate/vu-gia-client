"use client";

import React from "react";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import { ROUTES } from "@/utils/routes";

export default function ShippingPolicyView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Chính sách vận chuyển", href: null },
  ];

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[28px] md:text-[36px] font-[400] leading-[40px] md:leading-[48px] mb-6">
        Chính sách vận chuyển - đóng gói - kiểm hàng
      </h1>

      {/* Intro */}
      <p className="font-montserrat text-[#101010] text-[16px] font-[400] leading-[25px] mb-8">
        Tại Gốm Vũ Gia, chúng tôi hiểu rằng hàng gốm sứ rất dễ vỡ. Vì vậy, quy trình vận chuyển được chúng tôi thiết lập chuyên nghiệp để đảm bảo sản phẩm đến tay khách hàng an toàn với chi phí tối ưu nhất.
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="font-montserrat text-[#2E2F2A] text-[16px] font-[600] leading-[40px] mb-3">
          1. Phân loại Phí vận chuyển & Thời gian giao hàng
        </h2>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto mb-6">
          <table className="min-w-[700px] w-full border-collapse border border-black text-[14px] font-montserrat">
            <thead>
              <tr className="bg-white text-[#2E2F2A]">
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[127px]">
                  Khu vực
                </th>
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[158px]">
                  Phương thức<br />vận chuyển
                </th>
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px]">
                  Chi tiết chi phí & Ghi chú
                </th>
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[147px]">
                  Thời gian<br />dự kiến
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Nội thành Hà Nội - Ship ghép */}
              <tr className="text-[#101010]">
                <td
                  rowSpan={2}
                  className="border border-black px-4 py-3 font-[600] text-[16px] text-[#2E2F2A] text-center align-middle"
                >
                  Nội thành<br />Hà Nội
                </td>
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Ship ghép chuyến
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Phí từ 70.000đ (tùy số km). <br />
                  Giao theo khung giờ: Sáng (trước 13h) hoặc Chiều (trước 18h). <br />
                  Quý khách vui lòng báo trước 5 tiếng để sắp xếp lộ trình.
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  Trong hoặc<br />sau 1 ngày
                </td>
              </tr>
              {/* Row 2: Nội thành Hà Nội - Ship riêng */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Ship riêng chuyến
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Phí tính theo số km thực tế từ Bát Tràng đến địa chỉ nhận hàng. Ưu tiên thời gian theo yêu cầu của khách hàng.
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  Giao ngay
                </td>
              </tr>

              {/* Row 3: Tỉnh thành miền Bắc - Xe tải */}
              <tr className="text-[#101010]">
                <td
                  rowSpan={2}
                  className="border border-black px-4 py-3 font-[600] text-[16px] text-[#2E2F2A] text-center align-middle"
                >
                  Tỉnh thành<br />miền Bắc
                </td>
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Xe tải<br />chuyên dụng
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Khuyến khích cho đơn hàng nặng (từ 1 tấn trở lên). Vũ Gia hỗ trợ liên hệ nhà xe hoặc giao theo xe khách chỉ định.
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  1 - 2 ngày
                </td>
              </tr>
              {/* Row 4: Tỉnh thành miền Bắc - Gửi xe khách */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Gửi xe khách
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Phí = [Phí vận chuyển từ Bát Tràng ra bến xe] + [Cước nhà xe về địa chỉ khách].<br />
                  Giao tại các bến: Nước Ngầm, Giáp Bát, Gia Lâm.
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  1 - 2 ngày
                </td>
              </tr>

              {/* Row 5: Miền Trung & Miền Nam - Xe tải ghép */}
              <tr className="text-[#101010]">
                <td
                  rowSpan={2}
                  className="border border-black px-4 py-3 font-[600] text-[16px] text-[#2E2F2A] text-center align-middle"
                >
                  Miền Trung &<br />Miền Nam
                </td>
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Xe tải ghép<br />Bắc - Nam
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Áp dụng cho đơn hàng lớn. Cước tính theo thùng/kiện hoặc theo tấn (nếu đi riêng chuyến).
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  3 - 7 ngày
                </td>
              </tr>
              {/* Row 6: Miền Trung & Miền Nam - Gửi xe khách */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[500] italic text-center align-middle">
                  Gửi xe khách
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[25px]">
                  Áp dụng cho hàng mẫu hoặc đơn hàng số lượng ít để rút ngắn thời gian nhận hàng.
                </td>
                <td className="border border-black px-4 py-3 font-[400] text-center align-middle">
                  2 - 4 ngày
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="font-montserrat text-[#2E2F2A] text-[16px] font-[600] leading-[26px] mb-3">
          2. Quy định đóng gói & Bảo hiểm nứt vỡ
        </h2>
        <p className="font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-4">
          Sự an toàn của hàng hóa là ưu tiên hàng đầu của chúng tôi:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-4 space-y-2">
          <li>
            <strong>Tiêu chuẩn đóng gói:</strong> Tất cả sản phẩm được đóng trong thùng carton cứng hoặc đóng đai chắc chắn.
          </li>
          <li>
            <strong>Gia cố thùng gỗ:</strong> Với các mặt hàng giá trị cao hoặc vận chuyển đi xa, chúng tôi cung cấp dịch vụ đóng kiện gỗ với chi phí từ 50.000đ – 300.000đ (tùy kích thước) để đảm bảo an toàn tuyệt đối.
          </li>
          <li>
            <strong>Chính sách Bảo hiểm:</strong> Vũ Gia cam kết đền bù 100% giá trị sản phẩm nếu xảy ra nứt vỡ do lỗi vận chuyển.
          </li>
        </ul>
        <p className="font-montserrat text-[#101010] text-[16px] font-[400] italic leading-[26px] mb-6">
          *Lưu ý: Quý khách vui lòng quay video quá trình mở hộp hoặc kiểm tra trực tiếp khi nhận hàng để làm căn cứ áp dụng chính sách đền bù.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="font-montserrat text-[#2E2F2A] text-[16px] font-[600] leading-[26px] mb-3">
          3. Chính sách Kiểm hàng (Kiểm tra trước khi thanh toán)
        </h2>
        <p className="font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-4">
          Để bảo vệ quyền lợi tối đa, Gốm Vũ Gia khuyến khích khách hàng thực hiện các bước sau khi nhận hàng:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>
            <strong>Mở thùng kiểm tra:</strong> Quý khách hoàn toàn có quyền yêu cầu đơn vị vận chuyển đợi để kiểm tra sơ bộ tình trạng sản phẩm.
          </li>
          <li>
            <strong>Đối chiếu mẫu mã:</strong> Xác nhận sản phẩm đúng chủng loại, màu sắc và số lượng như trong đơn hàng/hợp đồng.
          </li>
          <li>
            <strong>Xác nhận tình trạng:</strong> Kiểm tra các lỗi sứt mẻ, trầy xước bề mặt. Nếu có vấn đề phát sinh, vui lòng liên hệ ngay hotline của chúng tôi để được xử lý kịp thời.
          </li>
        </ul>
      </section>

      {/* Explanatory Spacing text */}
      <p className="font-montserrat text-[#101010] text-[16px] font-[400] italic leading-[26px] mb-8">
        Đây là bảng hướng dẫn xử lý sự cố giúp khách hàng cảm thấy được bảo vệ và tin tưởng hơn vào dịch vụ hậu mãi của Gốm Vũ Gia. Bạn có thể đặt bảng này ngay dưới phần Chính sách vận chuyển hoặc gửi kèm trong email xác nhận đơn hàng:
      </p>

      {/* Incident Handling Table Section */}
      <section className="mb-8">
        <h2 className="font-montserrat text-[#2E2F2A] text-[16px] font-[600] leading-[26px] mb-4 uppercase">
          HƯỚNG DẪN XỬ LÝ KHI HÀNG HÓA CÓ SỰ CỐ (NỨT/VỠ)
        </h2>
        <p className="font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-6">
          Tại Gốm Vũ Gia, chúng tôi cam kết chịu trách nhiệm 100% đối với các rủi ro trong quá trình vận chuyển. Nếu quý khách gặp tình trạng hàng bị hư hỏng, xin đừng quá lo lắng và hãy thực hiện theo 3 bước đơn giản sau:
        </p>

        {/* Steps Table Wrapper */}
        <div className="w-full overflow-x-auto mb-6">
          <table className="min-w-[700px] w-full border-collapse border border-black text-[14px] font-montserrat">
            <thead>
              <tr className="bg-white text-[#2E2F2A]">
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[146px]">
                  Bước
                </th>
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[448px]">
                  Hành động của khách hàng
                </th>
                <th className="border border-black px-4 py-3 font-[600] text-[16px] leading-[25px] w-[302px]">
                  Trách nhiệm của Vũ Gia
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Step 1 */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[600] text-[#101010] text-center align-middle">
                  Bước 1
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px]">
                  <strong>Quay phim/Chụp ảnh:</strong> Chụp lại hiện trạng thùng hàng và các sản phẩm bị vỡ ngay khi mở kiện (giữ nguyên vị trí trong thùng).
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px] text-center align-middle">
                  Tiếp nhận thông tin qua Hotline/Zalo trực 24/7 để xác nhận sự cố.
                </td>
              </tr>
              {/* Step 2 */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[600] text-[#101010] text-center align-middle">
                  Bước 2
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px]">
                  <strong>Liên hệ ngay:</strong> Gọi Hotline hoặc gửi hình ảnh qua Zalo bộ phận chăm sóc khách hàng trong vòng 24h kể từ khi nhận hàng.
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px] text-center align-middle">
                  Phản hồi phương án xử lý trong vòng 2 tiếng làm việc.
                </td>
              </tr>
              {/* Step 3 */}
              <tr className="text-[#101010]">
                <td className="border border-black px-4 py-3 font-[600] text-[#101010] text-center align-middle">
                  Bước 3
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px]">
                  <strong>Xác nhận số lượng:</strong> Liệt kê mã sản phẩm và số lượng viên/mảnh bị vỡ để chúng tôi lên đơn hàng bù.
                </td>
                <td className="border border-black px-4 py-3 font-[400] leading-[26px] text-center align-middle">
                  Gửi bù sản phẩm mới 100% hoàn toàn miễn phí hoặc hoàn tiền tương ứng vào tài khoản khách hàng.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Spacing & Lưu ý */}
      <section className="mb-8">
        <h2 className="font-montserrat text-[#2E2F2A] text-[16px] font-[600] uppercase leading-[26px] mb-3">
          3 Lưu ý "Vàng" để được hỗ trợ nhanh nhất:
        </h2>
        <ul className="list-disc pl-5 font-montserrat text-[#101010] text-[16px] font-[400] leading-[26px] mb-8 space-y-2">
          <li>
            <strong>Đừng vội vứt bỏ:</strong> Vui lòng giữ lại các sản phẩm vỡ và bao bì cho đến khi sự cố được xác nhận xong.
          </li>
          <li>
            <strong>Ký biên bản:</strong> Nếu vận chuyển qua bên thứ 3 (xe khách/xe tải ghép), hãy yêu cầu tài xế ký xác nhận tình trạng vỡ vào phiếu giao hàng.
          </li>
          <li>
            <strong>Video mở hộp:</strong> Đây là bằng chứng thép giúp chúng tôi làm việc với đơn vị bảo hiểm và hỗ trợ quý khách thay thế hàng mới ngay lập tức mà không cần chờ đợi đối soát lâu.
          </li>
        </ul>
      </section>

      {/* Reassurance Quote */}
      <p className="font-montserrat text-[#101010] text-[16px] font-[400] italic leading-[26px] text-center my-8">
        "Sự an tâm của quý khách là ưu tiên hàng đầu của chúng tôi. Mọi rủi ro vận chuyển đã có Vũ Gia lo!"
      </p>
    </CustomerServiceLayout>
  );
}
