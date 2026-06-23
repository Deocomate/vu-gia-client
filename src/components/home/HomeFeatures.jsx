import Image from "next/image";

export default function HomeFeatures() {
  const features = [
    {
      title: "Tinh hoa Bát Tràng",
      mobileTitle: ["Tinh hoa", "Bát Tràng"],
      icon: "/images/home/tinh-hoa-bat-trang-icon.png",
    },
    {
      title: "Thủ công độc bản",
      mobileTitle: ["Thủ công", "độc bản"],
      icon: "/images/home/thu-cong-doc-ban-icon.png",
    },
    {
      title: "Chất lượng tuyển chọn",
      mobileTitle: ["Chất lượng", "tuyển chọn"],
      icon: "/images/home/chat-luong-tuyen-chon-icon.png",
    },
    {
      title: "Giao hàng đảm bảo",
      mobileTitle: ["Giao hàng", "đảm bảo"],
      icon: "/images/home/giao-hang-dam-bao-icon.png",
    },
  ];

  return (
    <section className="max-w-[1470px] mx-auto w-full px-[23px] mt-[26px] mb-[50px] lg:px-[30px] lg:my-[60px]">
      <div className="max-w-[1352px] mx-auto grid grid-cols-4 gap-x-0 lg:flex lg:flex-row lg:items-start lg:justify-between">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-start text-center w-full lg:w-auto"
          >
            <div className="relative w-[61px] h-[61px] lg:w-[121px] lg:h-[121px] flex-shrink-0">
              <Image
                src={item.icon}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 121px, 61px"
                className="object-contain"
              />
            </div>

            <h3 className="mt-[11px] lg:mt-[20.5px] font-amplify text-primary text-[24px] lg:text-[42px] leading-[normal] lg:leading-[32px] font-normal whitespace-nowrap">
              <span className="hidden lg:inline">{item.title}</span>
              <span className="lg:hidden">
                {item.mobileTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
