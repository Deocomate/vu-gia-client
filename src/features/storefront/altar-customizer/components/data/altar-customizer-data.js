import altarPreview from "@/assets/images/altar-customizer/altar-preview.png";
import batHuong1 from "@/assets/images/altar-customizer/bat-huong-1.png";
import batHuong2 from "@/assets/images/altar-customizer/bat-huong-2.png";
import batHuong3 from "@/assets/images/altar-customizer/bat-huong-3.png";
import accessoriesSprite from "@/assets/images/altar-customizer/accessories-sprite.png";
import similarProduct1 from "@/assets/images/altar-customizer/similar-product-1.jpg";
import similarProduct2 from "@/assets/images/altar-customizer/similar-product-2.jpg";
import similarProduct3 from "@/assets/images/altar-customizer/similar-product-3.jpg";

export const SELECTOR_STEPS = [
  { id: 1, title: "Chọn loại bàn thờ", value: "Bàn thờ gia tiên" },
  { id: 2, title: "Chọn kích thước", value: "127 x 61 cm" },
  { id: 3, title: "Chọn phong cách", value: "Men lam vẽ vàng" },
  { id: 4, title: "Chọn bộ gợi ý", value: "Bộ tiêu chuẩn" },
];

export const PRODUCT_TABS = [
  "Tất cả",
  "Bộ tam sự - ngũ sự",
  "Bát hương & phụ kiện",
  "Lọ hoa & phụ kiện",
  "Phụ kiện thờ",
  "Thần tài - Thổ địa",
];

export const CUSTOMIZER_PRODUCTS = [
  {
    id: "bat-huong-1",
    name: "Bát hương 20cm",
    displayName: "Bát hương size S",
    size: "20 cm",
    price: 850000,
    image: batHuong1,
    tab: "Bát hương & phụ kiện",
    imageVariant: 1,
  },
  {
    id: "bat-huong-2",
    name: "Bát hương 20cm",
    displayName: "Bát hương size S",
    size: "20 cm",
    price: 850000,
    image: batHuong2,
    tab: "Bát hương & phụ kiện",
    imageVariant: 2,
  },
  {
    id: "bat-huong-3",
    name: "Bát hương 20cm",
    displayName: "Bát hương size S",
    size: "20 cm",
    price: 850000,
    image: batHuong3,
    tab: "Bát hương & phụ kiện",
    imageVariant: 3,
  },
  {
    id: "bat-huong-4",
    name: "Bát hương 20cm",
    displayName: "Bát hương size S",
    size: "20 cm",
    price: 850000,
    image: batHuong2,
    tab: "Bát hương & phụ kiện",
    imageVariant: 4,
  },
];

export const ACCESSORIES = [
  {
    id: "tro-nep",
    name: "Tro nếp",
    price: 120000,
    image: accessoriesSprite,
    spriteClass: "accessory-image-tro",
  },
  {
    id: "cot-bat-huong",
    name: "Cốt bát hương",
    price: 150000,
    image: accessoriesSprite,
    spriteClass: "accessory-image-cot",
  },
  {
    id: "bo-that-thao",
    name: "Bộ thất thảo",
    price: 250000,
    image: accessoriesSprite,
    spriteClass: "accessory-image-that-thao",
  },
];

export const INITIAL_CART_ITEMS = [
  { name: "Bát hương 20cm", qty: 1, unitPrice: 850000 },
  { name: "Lọ hoa 28cm", qty: 2, unitPrice: 700000 },
  { name: "Mâm bồng 24cm", qty: 1, unitPrice: 650000 },
  { name: "Kỷ 5 chén", qty: 1, unitPrice: 550000 },
  { name: "Chóe 18cm", qty: 1, unitPrice: 1200000 },
  { name: "Ống hương 31cm", qty: 1, unitPrice: 450000 },
];

export const SIZE_GUIDE_ROWS = [
  { stt: 1, altar: "41 - 48 cm", batHuong: "12 - 14 cm", mamBong: "18 cm", loHoa: "H20", choe: "H14", kyNuoc: "3 chén", phuKien: "S2" },
  { stt: 2, altar: "61 - 67 cm", batHuong: "14 - 16 cm", mamBong: "20 - 22cm", loHoa: "H20, 23, 25", choe: "H14", kyNuoc: "3 chén", phuKien: "S2" },
  { stt: 3, altar: "81 - 89 cm", batHuong: "14 - 16 - 18 cm", mamBong: "20 - 22 - 25 cm", loHoa: "H23, 25, 26", choe: "H14, 16", kyNuoc: "3, 5 chén", phuKien: "S2" },
  { stt: 4, altar: "107 - 127 cm", batHuong: "16 - 18 - 20 cm", mamBong: "16 - 18 - 20 cm", loHoa: "H25, 26, 30", choe: "H16", kyNuoc: "3, 5 chén", phuKien: "S2" },
  { stt: 5, altar: "153 - 155 cm", batHuong: "16 - 18 - 20 cm", mamBong: "16 - 18 - 20 cm", loHoa: "H25, 26, 30, 35, 40", choe: "H16, 19", kyNuoc: "3, 5 chén", phuKien: "S1, 2" },
  { stt: 6, altar: "175 - 197 cm", batHuong: "18 - 20 - 22 cm", mamBong: "18 - 20 - 22 cm", loHoa: "H25, 26, 30, 35, 40, 50", choe: "H16, 19", kyNuoc: "5 chén", phuKien: "S1" },
  { stt: 7, altar: "217 cm", batHuong: "20 - 22 - 25 -27 cm", mamBong: "20 - 22 - 25 -27 cm", loHoa: "H30, 35, 40, 50", choe: "H19, 21", kyNuoc: "5 chén", phuKien: "S1" },
];

export const SIMILAR_PRODUCTS = [
  { id: 1, name: "Bình hút lộc\nMã đáo thành công", sku: "MSP: VG001", salePrice: "2.000.000đ", originalPrice: "2.500.000đ", soldCount: 12, image: similarProduct1 },
  { id: 2, name: "Bình hút lộc\nMã đáo thành công", sku: "MSP: VG001", salePrice: "2.000.000đ", originalPrice: "2.500.000đ", soldCount: 12, image: similarProduct2 },
  { id: 3, name: "Bình hút lộc\nMã đáo thành công", sku: "MSP: VG001", salePrice: "2.000.000đ", originalPrice: "2.500.000đ", soldCount: 12, image: similarProduct3 },
  { id: 4, name: "Bình hút lộc\nMã đáo thành công", sku: "MSP: VG001", salePrice: "2.000.000đ", originalPrice: "2.500.000đ", soldCount: 12, image: similarProduct3 },
];

export { altarPreview };
