// src/components/home/HomeFeatures.jsx
import Image from "next/image";

export default function HomeFeatures() {
  const features = [
    {
      title: "Tinh hoa Bát Tràng",
      icon: "/images/home/tinh-hoa-bat-trang-icon.png",
    },
    {
      title: "Thủ công độc bản",
      icon: "/images/home/thu-cong-doc-ban-icon.png",
    },
    {
      title: "Chất lượng tuyển chọn",
      icon: "/images/home/chat-luong-tuyen-chon-icon.png",
    },
    {
      title: "Giao hàng đảm bảo",
      icon: "/images/home/giao-hang-dam-bao-icon.png",
    },
  ];

  return (
    <section className="max-w-[1470px] mx-auto w-full px-[30px] my-[60px] lg:my-[60px]">
      <div className="max-w-[1352px] mx-auto grid grid-cols-2 gap-y-12 gap-x-4 lg:flex lg:flex-row lg:items-start lg:justify-between">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-start text-center w-full lg:w-auto"
          >
            {/* Wrapper cho Icon 121x121 */}
            <div className="relative w-[121px] h-[121px] flex-shrink-0">
              <Image
                src={item.icon}
                alt={item.title}
                fill
                sizes="121px"
                className="object-contain"
              />
            </div>

            {/* Tiêu đề với Font UVF Amplify */}
            <h3 className="mt-[20.5px] font-amplify text-primary text-[32px] lg:text-[42px] leading-[32px] font-normal">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
