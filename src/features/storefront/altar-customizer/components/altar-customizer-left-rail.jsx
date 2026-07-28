import { Clock, Phone } from "lucide-react";
import Image from "next/image";
import AltarCustomizerSelectors from "./altar-customizer-selectors";

export default function AltarCustomizerLeftRail({
  models,
  styles,
  loadingCatalog,
  altarModelId,
  altarSizeId,
  altarStyleId,
  presetId,
  onSelectModel,
  onSelectSize,
  onSelectStyle,
  onSelectPreset,
}) {
  return (
    <aside className="left-rail">
      <AltarCustomizerSelectors
        models={models}
        styles={styles}
        loadingCatalog={loadingCatalog}
        altarModelId={altarModelId}
        altarSizeId={altarSizeId}
        altarStyleId={altarStyleId}
        presetId={presetId}
        onSelectModel={onSelectModel}
        onSelectSize={onSelectSize}
        onSelectStyle={onSelectStyle}
        onSelectPreset={onSelectPreset}
      />

      <div className="guide-card">
        <h3>
          <Image src="/icons/guide.svg" width={26} height={24} className="rail-icon guide-icon" alt="" />
          Hướng dẫn sử dụng
        </h3>
        <p>
          Chọn thông tin bên trái để hệ thống gợi ý bố cục ban đầu. Sau đó, bạn có thể thêm, bớt hoặc sắp xếp lại vật phẩm theo ý muốn
        </p>
      </div>

      <div className="support-card hidden lg:block">
        <h3>
          <Image src="/icons/support.svg" width={19} height={22} className="rail-icon support-icon" alt="" />
          Cần hỗ trợ
        </h3>
        <p>Đội ngũ Gốm Vũ Gia luôn sẵn sàng hỗ trợ và tư vấn cho bạn</p>
        <strong className="support-phone">
          <Phone className="rail-icon phone-icon" aria-hidden="true" />
          0394 123 981
        </strong>
        <small className="support-hours">
          <Clock className="rail-icon clock-icon" aria-hidden="true" />
          Thời gian: 8:00 - 18:00 (T2 - CN)
        </small>
      </div>
    </aside>
  );
}
