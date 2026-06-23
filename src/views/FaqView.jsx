"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

const FAQ_DATA = [
  {
    id: "san-pham",
    title: "Sản phẩm",
    items: [
      {
        question: "Gốm sứ xây dựng Vũ Gia có phải là hàng thủ công không?",
        answer: "Đúng vậy. Chúng tôi tự hào duy trì quy trình sản xuất thủ công truyền thống. Từ khâu chọn đất, tạo hình, đến tráng men và nung lò. Mỗi sản phẩm đều mang dấu ấn bàn tay khéo léo của các nghệ nhân. Điều này tạo nên vẻ đẹp độc bản mà các loại gạch ngói công nghiệp sản xuất hàng loạt không thể có được."
      },
      {
        question: "Tôi có thể mua hàng như thế nào?",
        answer: "Bạn có thể mua hàng trực tiếp tại showroom, qua Hotline hoặc các kênh mạng xã hội của chúng tôi."
      },
      {
        question: "Tôi có thể lấy mẫu thử không?",
        answer: "Chúng tôi sẵn sàng gửi mẫu thử cho khách hàng ở xa. Vui lòng liên hệ để được hỗ trợ."
      },
      {
        question: "Các sản phẩm của gốm sứ Vũ Gia có bền khi sử dụng ngoài trời hay không?",
        answer: "Tất cả sản phẩm của chúng tôi đều được nung ở nhiệt độ cao (1200°C), đảm bảo độ bền tuyệt đối khi sử dụng ngoài trời. Chất liệu đất sét Bát Tràng kết hợp men hỏa biến giúp sản phẩm chống thấm nước, chống rêu mốc vĩnh viễn."
      },
      {
        question: "Màu men có bị phai dưới ánh nắng mặt trời không?",
        answer: "Lớp men gốm được nung hỏa biến ở nhiệt độ 1200°C, cam kết không bao giờ phai màu dưới tác động của thời tiết. Màu men hòa quyện vào xương gốm trong quá trình nung, tạo nên độ bền màu vĩnh cửu."
      }
    ]
  },
  {
    id: "bao-gia",
    title: "Báo giá",
    items: [
      {
        question: "Giá sản phẩm được tính như thế nào?",
        answer: "Giá gốm sứ xây dựng thường được tính theo mét vuông (m²), mét dài (md) hoặc theo viên/cặp đối với các dòng gạch, ngói và tính theo đơn vị đôi/chiếc đối với các sản phẩm đơn lẻ. Giá phụ thuộc vào kích thước, loại men, và độ phức tạp của hình dáng sản phẩm."
      },
      {
        question: "Đặt hàng số lượng lớn có được chiết khấu không?",
        answer: "Chúng tôi luôn có chính sách chiết khấu linh hoạt và cạnh tranh cho các đơn hàng số lượng lớn, đặc biệt là các dự án công trình trọng điểm. Vui lòng liên hệ trực tiếp để nhận báo giá ưu đãi nhất."
      },
      {
        question: "Có yêu cầu số lượng đặt hàng tối thiểu không?",
        answer: "Chúng tôi tiếp nhận mọi đơn hàng, từ một sản phẩm đơn lẻ đến các đơn hàng lớn cho công trình quy mô hàng nghìn mét vuông."
      },
      {
        question: "Màu sắc có ảnh hưởng đến giá sản phẩm không?",
        answer: "Một số màu men hỏa biến đặc biệt hoặc yêu cầu pha chế màu riêng theo thiết kế có thể có sự chênh lệch nhẹ về giá so với các màu men tiêu chuẩn."
      },
      {
        question: "Tại sao các kích thước nhỏ lại đắt hơn nhiều so với các kích thước lớn?",
        answer: "Kích thước nhỏ đòi hỏi sự tỉ mỉ cao hơn trong khâu tạo hình và hoàn thiện thủ công. Công sức cho mỗi cm² sản phẩm nhỏ lớn hơn đáng kể, đồng thời tỷ lệ hao hụt trong quá trình nung cũng cao hơn."
      }
    ]
  },
  {
    id: "van-chuyen",
    title: "Vận chuyển & thời gian giao hàng",
    items: [
      {
        question: "Thời gian sản xuất và giao hàng là bao lâu?",
        answer: "Đối với hàng có sẵn: Chúng tôi có thể giao hàng trong vòng 2-5 ngày làm việc.<br/>Đối với hàng đặt sản xuất: Thường mất từ 3-6 tuần tùy vào quy mô đơn hàng và điều kiện thời tiết (ảnh hưởng đến quá trình phơi gốm mộc)."
      },
      {
        question: "Các bạn có giao hàng toàn quốc không?",
        answer: "Chúng tôi vận chuyển toàn quốc bằng xe tải chuyên dụng hoặc đối tác logistic uy tín. Hàng hóa được đóng gói cẩn thận, đảm bảo an toàn trong suốt quá trình vận chuyển."
      },
      {
        question: "Tôi nên lưu ý gì khi lắp đặt gốm thủ công?",
        answer: "Nên sử dụng thợ có tay nghề và am hiểu đặc tính gốm nung thủ công. Chúng tôi luôn cung cấp tài liệu hướng dẫn lắp đặt chi tiết kèm theo mỗi đơn hàng."
      },
      {
        question: "Các bạn có vận chuyển quốc tế không?",
        answer: "Có. Chúng tôi hỗ trợ đóng gói kiện gỗ xuất khẩu đạt chuẩn và làm thủ tục hải quan cần thiết cho các đơn hàng quốc tế."
      },
      {
        question: "Tôi có thể tự đến lấy hàng trực tiếp không?",
        answer: "Quý khách có thể nhận hàng trực tiếp tại xưởng sản xuất hoặc showroom của chúng tôi. Vui lòng liên hệ trước để chúng tôi chuẩn bị hàng sẵn sàng."
      }
    ]
  },
  {
    id: "bao-hanh",
    title: "Chính sách bảo hành",
    items: [
      {
        question: "Gốm sứ xây dựng Vũ Gia có chính sách bảo hành như thế nào?",
        answer: "Chúng tôi bảo hành độ bền màu men trọn đời đối với tất cả các dòng sản phẩm gốm sứ xây dựng và trang trí. Đối với độ bền xương gốm, cam kết bảo hành 10 năm trong điều kiện thời tiết tự nhiên thông thường."
      },
      {
        question: "Làm thế nào để yêu cầu xử lý bảo hành?",
        answer: "Quý khách chỉ cần liên hệ Hotline chăm sóc khách hàng, cung cấp số điện thoại đặt hàng hoặc mã hóa đơn. Đội ngũ kỹ thuật của Vũ Gia sẽ phản hồi và tiến hành xác minh thực tế trong vòng 48h."
      }
    ]
  },
  {
    id: "doi-tra",
    title: "Đổi trả",
    items: [
      {
        question: "Chính sách đổi trả sản phẩm như thế nào?",
        answer: "Khách hàng được quyền đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng đối với các trường hợp: sản phẩm bị nứt vỡ do lỗi vận chuyển, lỗi tráng men nghiêm trọng hoặc giao sai mẫu mã so với hợp đồng đã ký kết."
      },
      {
        question: "Đơn hàng đặt riêng (sản xuất theo yêu cầu) có được đổi trả không?",
        answer: "Đối với các đơn hàng đặt riêng theo yêu cầu thiết kế đặc biệt của khách hàng, chúng tôi chỉ áp dụng chính sách đổi trả/thay thế đối với sản phẩm bị lỗi kỹ thuật trong khâu sản xuất hoặc nứt vỡ do vận chuyển."
      }
    ]
  }
];

export default function FaqView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("san-pham");
  const [openItems, setOpenItems] = useState({
    "san-pham-0": true,
    "bao-gia-0": true,
    "van-chuyen-0": true,
    "bao-hanh-0": true,
    "doi-tra-0": true,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const section of FAQ_DATA) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const filteredData = FAQ_DATA.map((section) => {
    const matchingItems = section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchingItems };
  }).filter((section) => section.items.length > 0);

  return (
    <div className="w-full bg-white">
      {/* Top Banner Section */}
      <section className="relative w-full h-[300px] md:h-[400px] flex items-end justify-center overflow-hidden pb-8 md:pb-12 bg-[#2E2F2A]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://demo.thceramics.vn/storage/assets/images/faq-banner.png"
            alt="FAQ Banner"
            className="w-full h-full object-cover opacity-80"
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/25"></div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 w-[90%] max-w-[735px]">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập nội dung tìm kiếm..."
              className="w-full font-archivo font-extralight h-12 md:h-16 px-6 pl-16 text-base lg:text-lg rounded-full bg-white/20 backdrop-blur-md border-[2px] border-white focus:bg-white/30 focus:outline-none transition-all text-white placeholder:text-white italic shadow-2xl"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-[85%] max-w-[1320px] mx-auto pt-12 pb-16 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 h-fit">
          <div className="mb-8">
            <h1 className="text-[48px] font-aref-ruqaa text-[#2E2F2A] mb-4 md:mb-6 font-bold leading-[40px]">
              FAQ
            </h1>
            <hr className="border-t border-black/10 w-full" />
          </div>
          <nav className="flex flex-col gap-3">
            {FAQ_DATA.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(e, section.id)}
                className={`text-[14px] font-archivo font-medium uppercase leading-[40px] tracking-wider transition-colors duration-200 select-none ${
                  activeSection === section.id
                    ? "text-[#97400C]"
                    : "text-[#2E2F2A] hover:text-[#97400C]"
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[14px] font-archivo font-normal leading-[40px] text-[#2E2F2A]/60 mb-8 font-medium">
            <Link href={ROUTES.HOME} className="text-[#2E2F2A] hover:underline transition-all">
              Trang chủ
            </Link>
            <span>&gt;</span>
            <span className="text-[#2E2F2A]">Câu hỏi thường gặp</span>
          </div>

          {filteredData.length > 0 ? (
            <div className="space-y-12">
              {filteredData.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-28">
                  {/* Category Header */}
                  <div className="flex items-center gap-[12px] mb-8 pt-4 border-b border-[#2E2F2A]/5 pb-4">
                    <div className="w-[6px] h-8 bg-[#97400C]"></div>
                    <h2 className="text-[32px] leading-[40px] font-arima font-semibold text-[#2E2F2A]">
                      {section.title}
                    </h2>
                  </div>

                  {/* Accordion List */}
                  <div className="divide-y divide-[#2E2F2A]/10">
                    {section.items.map((item, itemIdx) => {
                      const itemKey = `${section.id}-${itemIdx}`;
                      const isOpen = searchQuery ? true : !!openItems[itemKey];

                      return (
                        <div key={itemKey} className="py-4">
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full flex justify-between items-center text-left gap-4 group focus:outline-none py-3"
                          >
                            <span className="text-[16px] font-arima font-medium leading-[28px] text-[#2E2F2A] group-hover:text-[#97400C] transition-colors duration-200">
                              {item.question}
                            </span>
                            <span className="flex-shrink-0 text-[#97400C] transition-transform duration-300">
                              {isOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              )}
                            </span>
                          </button>

                          {/* Accordion Content wrapper with smooth animation */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="pt-2 pb-4 pr-6">
                              <p
                                className="text-[14px] font-archivo font-[200] leading-[25px] text-[#2E2F2A] text-justify"
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#2E2F2A]/60 font-archivo">
              Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
