"use client";

import React from "react";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import { ROUTES } from "@/utils/routes";

export default function PrivacyPolicyView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Bảo mật thông tin", href: null },
  ];

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[28px] md:text-[36px] font-[400] leading-[40px] md:leading-[48px] mb-6">
        Chính sách bảo mật thông tin
      </h1>

      {/* Intro */}
      <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-8">
        Gốm Vũ Gia cam kết tôn trọng và bảo vệ quyền riêng tư của khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân mà bạn cung cấp khi truy cập website hoặc sử dụng dịch vụ của chúng tôi.
      </p>

      {/* Section 1 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Mục đích thu thập thông tin cá nhân
        </h2>
        <ul className="list-disc pl-5 font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>
            <strong>Xử lý đơn hàng:</strong> Giao hàng, thông báo về tiến độ sản xuất gốm sứ theo yêu cầu và thanh toán.
          </li>
          <li>
            <strong>Tư vấn chuyên sâu:</strong> Hỗ trợ giải đáp các thắc mắc về sản phẩm, kỹ thuật thi công hoặc thiết kế sản phẩm mới.
          </li>
          <li>
            <strong>Cải thiện dịch vụ:</strong> Phân tích hành vi người dùng trên website để tối ưu hóa trải nghiệm mua sắm.
          </li>
          <li>
            <strong>Tiếp thị & Truyền thông:</strong> Gửi thông tin về các sản phẩm gốm mới, chương trình ưu đãi (chỉ khi có sự đồng ý của bạn).
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Phạm vi sử dụng thông tin
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-3">
          Các thông tin chúng tôi có thể thu thập bao gồm:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>Họ và tên, số điện thoại, email.</li>
          <li>Địa chỉ giao hàng (công trình hoặc nhà riêng).</li>
          <li>Nội dung tư vấn/Yêu cầu thiết kế riêng.</li>
          <li>Thông tin thanh toán (không bao gồm thông tin thẻ tín dụng trực tiếp trên hệ thống của chúng tôi).</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Thời gian lưu trữ thông tin
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6">
          Thông tin cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ từ phía khách hàng hoặc khi thông tin đó không còn cần thiết cho các mục đích nêu trên. Trong mọi trường hợp, thông tin khách hàng sẽ được bảo mật trên máy chủ của Gốm Vũ Gia.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Chia sẻ thông tin với bên thứ ba
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-3">
          Chúng tôi cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào, ngoại trừ các trường hợp cần thiết sau:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>
            <strong>Đơn vị vận chuyển:</strong> Cung cấp tên, số điện thoại và địa chỉ để giao hàng đến tận công trình.
          </li>
          <li>
            <strong>Theo yêu cầu pháp luật:</strong> Khi có yêu cầu từ các cơ quan chức năng có thẩm quyền theo quy định của pháp luật Việt Nam.
          </li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Cam kết bảo mật thông tin
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-3">
          Chúng tôi áp dụng các biện pháp an ninh kỹ thuật cao để bảo vệ thông tin cá nhân của bạn:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>Sử dụng giao thức mã hóa SSL (Secure Sockets Layer) để đảm bảo an toàn dữ liệu truyền tải qua internet.</li>
          <li>Hệ thống tường lửa và kiểm soát truy cập nghiêm ngặt đối với nhân viên nội bộ.</li>
          <li>Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân, chúng tôi sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý và thông báo kịp thời cho khách hàng.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Quyền của khách hàng đối với thông tin cá nhân
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-3">
          Khách hàng có quyền:
        </p>
        <ul className="list-disc pl-5 font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-6 space-y-2">
          <li>Yêu cầu kiểm tra, cập nhật hoặc điều chỉnh thông tin cá nhân của mình.</li>
          <li>Yêu cầu dừng việc sử dụng thông tin cho mục đích quảng cáo/tiếp thị.</li>
          <li>Yêu cầu xóa bỏ hoàn toàn dữ liệu cá nhân trên hệ thống của chúng tôi.</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section className="mb-6">
        <h2 className="font-montserrat text-black text-[16px] font-[600] leading-[26px] mb-3">
          Thông tin liên hệ đơn vị thu thập và quản lý
        </h2>
        <p className="font-montserrat text-black text-[16px] font-[400] leading-[26px] mb-4">
          Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến chính sách bảo mật, vui lòng liên hệ:
        </p>

        <div className="font-montserrat text-[#2E2F2A] text-[16px] leading-[28px] mt-2 space-y-1">
          <p className="font-[700] text-[18px] mb-2">Thanh Hai Co.,Ltd</p>
          <p>
            <span className="font-[700]">Địa chỉ: </span>Số 18 Phố Gốm - Giang Cao - Bát Tràng - Hà Nội
          </p>
          <p>
            <span className="font-[700]">Hotline: </span>091 7777 247
          </p>
          <p>
            <span className="font-[700]">Email: </span>gomvugia@gmail.com
          </p>
          <p>
            <span className="font-[700]">Website: </span>
            <a
              href="https://gomvugia.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-all duration-300"
            >
              https://gomvugia.vn
            </a>
          </p>
        </div>
      </section>
    </CustomerServiceLayout>
  );
}
