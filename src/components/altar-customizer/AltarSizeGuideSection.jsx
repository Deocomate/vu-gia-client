import { SIZE_GUIDE_ROWS } from "./data/altarCustomizerData";

export default function AltarSizeGuideSection() {
  return (
    <section className="mt-10 text-center px-4 md:px-0">
      <h2 className="m-0 mb-10 text-primary text-[22px] leading-10 font-semibold tracking-[-0.22px]">
        Bảng gợi ý kích thước vật phẩm đồ thờ theo kích thước ban thờ
      </h2>
      <div className="w-full max-w-[1422px] mx-auto overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[900px]">
          <thead>
            <tr>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                STT
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Kích thước bàn thờ
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Bát hương
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Mâm bồng
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Lọ hoa
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Chóe
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Kỷ nước
              </th>
              <th className="h-16 px-4 text-center text-[#2e2f2a] text-[18px] leading-[25px] font-bold uppercase bg-[#f2f3f5]">
                Phụ kiện
              </th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((row) => (
              <tr key={row.stt} className="even:[&>td]:bg-[#f2f3f5]">
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.stt}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-semibold">
                  {row.altar}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.batHuong}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.mamBong}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.loHoa}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.choe}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.kyNuoc}
                </td>
                <td className="h-[65px] px-4 text-center text-[#101010] text-[18px] leading-[25px] font-normal">
                  {row.phuKien}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
