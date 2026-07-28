// Static editorial content only. Per plan decision D4, the size-guide table has no backing
// entity/seeder/admin CRUD (unlike everything else this feature used to hardcode here — models,
// styles, products, accessories, cart items, similar products — all now come from the real
// altar-model/altar-style/altar-customizer-items/products APIs, see the sibling hooks/components).
export const SIZE_GUIDE_ROWS = [
  { stt: 1, altar: "41 - 48 cm", batHuong: "12 - 14 cm", mamBong: "18 cm", loHoa: "H20", choe: "H14", kyNuoc: "3 chén", phuKien: "S2" },
  { stt: 2, altar: "61 - 67 cm", batHuong: "14 - 16 cm", mamBong: "20 - 22cm", loHoa: "H20, 23, 25", choe: "H14", kyNuoc: "3 chén", phuKien: "S2" },
  { stt: 3, altar: "81 - 89 cm", batHuong: "14 - 16 - 18 cm", mamBong: "20 - 22 - 25 cm", loHoa: "H23, 25, 26", choe: "H14, 16", kyNuoc: "3, 5 chén", phuKien: "S2" },
  { stt: 4, altar: "107 - 127 cm", batHuong: "16 - 18 - 20 cm", mamBong: "16 - 18 - 20 cm", loHoa: "H25, 26, 30", choe: "H16", kyNuoc: "3, 5 chén", phuKien: "S2" },
  { stt: 5, altar: "153 - 155 cm", batHuong: "16 - 18 - 20 cm", mamBong: "16 - 18 - 20 cm", loHoa: "H25, 26, 30, 35, 40", choe: "H16, 19", kyNuoc: "3, 5 chén", phuKien: "S1, 2" },
  { stt: 6, altar: "175 - 197 cm", batHuong: "18 - 20 - 22 cm", mamBong: "18 - 20 - 22 cm", loHoa: "H25, 26, 30, 35, 40, 50", choe: "H16, 19", kyNuoc: "5 chén", phuKien: "S1" },
  { stt: 7, altar: "217 cm", batHuong: "20 - 22 - 25 -27 cm", mamBong: "20 - 22 - 25 -27 cm", loHoa: "H30, 35, 40, 50", choe: "H19, 21", kyNuoc: "5 chén", phuKien: "S1" },
];
