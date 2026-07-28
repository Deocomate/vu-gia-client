"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { publicGet, PublicApiError } from "@/shared/api/public-api";

function formatMoney(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
}

/**
 * Real model → size → style → preset selectors, replacing the old hardcoded `SELECTOR_STEPS`
 * list. Each row is a button that toggles an absolutely-positioned dropdown of live options
 * (`.selector-options`, see `altar-customizer.css`) — an overlay, not a reflow, so it doesn't
 * disturb the surrounding card's fixed height/positioning math.
 *
 * Presets load lazily, only while the preset row is open (per the phase plan's "Data loading"
 * section) — `GET /altar-presets` already embeds each preset's `items[]`, so no extra per-preset
 * detail fetch is needed once one is picked (see `mapPresetToCanvasState`).
 */
export default function AltarCustomizerSelectors({
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
  const [openStep, setOpenStep] = useState(null);
  const [presets, setPresets] = useState([]);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [presetsError, setPresetsError] = useState("");

  const activeModel = models.find((model) => model.id === altarModelId) || null;
  const activeSize = (activeModel?.sizes || []).find((size) => size.id === altarSizeId) || null;
  const activeStyle = styles.find((style) => style.id === altarStyleId) || null;

  useEffect(() => {
    if (openStep !== "preset" || !altarSizeId) return undefined;
    let cancelled = false;
    setPresetsLoading(true);
    setPresetsError("");
    publicGet("/altar-presets", { altarModelSizeId: altarSizeId, altarStyleId: altarStyleId || undefined, size: 50 })
      .then((data) => {
        if (!cancelled) setPresets(data?.content || []);
      })
      .catch((requestError) => {
        if (cancelled) return;
        setPresetsError(
          requestError instanceof PublicApiError ? requestError.message : "Không thể tải bộ gợi ý.",
        );
      })
      .finally(() => {
        if (!cancelled) setPresetsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [openStep, altarSizeId, altarStyleId]);

  const activePreset = presets.find((preset) => preset.id === presetId) || null;
  const toggleStep = (key) => setOpenStep((current) => (current === key ? null : key));

  const steps = [
    {
      id: 1,
      key: "model",
      title: "Chọn loại bàn thờ",
      value: activeModel?.name || (loadingCatalog ? "Đang tải..." : "Chưa chọn"),
      content: (
        <div className="selector-options">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              className={`selector-option${model.id === altarModelId ? " is-selected" : ""}`}
              onClick={() => {
                onSelectModel(model.id);
                setOpenStep(null);
              }}
            >
              {model.name}
            </button>
          ))}
          {models.length === 0 && <p className="selector-empty">Chưa có loại bàn thờ.</p>}
        </div>
      ),
    },
    {
      id: 2,
      key: "size",
      title: "Chọn kích thước",
      value: activeSize ? `${activeSize.widthCm} x ${activeSize.depthCm} cm` : "Chưa chọn",
      content: (
        <div className="selector-options">
          {(activeModel?.sizes || [])
            .filter((size) => size.isActive !== false)
            .map((size) => (
              <button
                key={size.id}
                type="button"
                className={`selector-option${size.id === altarSizeId ? " is-selected" : ""}`}
                onClick={() => {
                  onSelectSize(size.id);
                  setOpenStep(null);
                }}
              >
                {size.label ? `${size.label} · ` : ""}
                {size.widthCm} x {size.depthCm} cm
              </button>
            ))}
          {(!activeModel || (activeModel.sizes || []).length === 0) && (
            <p className="selector-empty">Chọn loại bàn thờ trước.</p>
          )}
        </div>
      ),
    },
    {
      id: 3,
      key: "style",
      title: "Chọn phong cách",
      value: activeStyle?.name || "Tất cả phong cách",
      content: (
        <div className="selector-options">
          <button
            type="button"
            className={`selector-option${!altarStyleId ? " is-selected" : ""}`}
            onClick={() => {
              onSelectStyle(null);
              setOpenStep(null);
            }}
          >
            Tất cả phong cách
          </button>
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`selector-option${style.id === altarStyleId ? " is-selected" : ""}`}
              onClick={() => {
                onSelectStyle(style.id);
                setOpenStep(null);
              }}
            >
              {style.name}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      key: "preset",
      title: "Chọn bộ gợi ý",
      value: activePreset?.name || "Tự sắp xếp",
      content: (
        <div className="selector-options">
          {presetsLoading && <p className="selector-empty">Đang tải bộ gợi ý...</p>}
          {presetsError && <p className="selector-empty">{presetsError}</p>}
          {!presetsLoading && !presetsError && presets.length === 0 && (
            <p className="selector-empty">Chưa có bộ gợi ý cho lựa chọn này.</p>
          )}
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`selector-option${preset.id === presetId ? " is-selected" : ""}`}
              onClick={() => {
                onSelectPreset(preset);
                setOpenStep(null);
              }}
            >
              <span>{preset.name}</span>
              <b>{formatMoney(preset.priceSummary)}</b>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="selector-card">
      {steps.map((step) => (
        <div key={step.key} className={`selector-step${openStep === step.key ? " is-open" : ""}`}>
          <button
            type="button"
            className={`selector-row${openStep === step.key ? " is-active" : ""}`}
            onClick={() => toggleStep(step.key)}
            aria-expanded={openStep === step.key}
          >
            <span className="step-index">{step.id}</span>
            <span>
              <strong>{step.title}</strong>
              <em>{step.value}</em>
            </span>
            <ChevronRight className="selector-chevron" aria-hidden="true" />
          </button>
          {openStep === step.key && step.content}
        </div>
      ))}
    </div>
  );
}
