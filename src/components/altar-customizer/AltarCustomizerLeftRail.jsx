import {
  ChevronRight,
  Clock,
  Headset,
  Phone,
  Users,
} from "lucide-react";
import { SELECTOR_STEPS } from "./data/altarCustomizerData";

export default function AltarCustomizerLeftRail({ activeStep, onStepChange }) {
  return (
    <aside className="left-rail">
      <div className="selector-card">
        {SELECTOR_STEPS.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`selector-row${activeStep === index ? " is-active" : ""}`}
            onClick={() => onStepChange(index)}
          >
            <span className="step-index">{step.id}</span>
            <span>
              <strong>{step.title}</strong>
              <em>{step.value}</em>
            </span>
            <ChevronRight className="selector-chevron" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="guide-card">
        <h3>
          <Users className="rail-icon guide-icon" aria-hidden="true" />
          Hướng dẫn sử dụng
        </h3>
        <p>
          Chọn thông tin bên trái để hệ thống gợi ý bố cục ban đầu. Sau đó, bạn có thể thêm, bớt hoặc sắp xếp lại vật phẩm theo ý muốn
        </p>
      </div>

      <div className="support-card">
        <h3>
          <Headset className="rail-icon support-icon" aria-hidden="true" />
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
