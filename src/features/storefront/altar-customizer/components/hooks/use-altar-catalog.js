"use client";

import { useEffect, useState } from "react";
import { publicGet, PublicApiError } from "@/shared/api/public-api";

/**
 * Loads the customizer's static catalog on mount: altar models (with sizes embedded), item
 * groups, styles, and the full customizer product feed (`GET /altar-customizer/items`).
 *
 * The product feed is fetched once, unfiltered, and filtered client-side by group/style in
 * `altar-customizer-item-palette.jsx` rather than refetched per filter change — the phase plan
 * calls for measuring the payload and picking client-side filtering "unless it exceeds ~200
 * items"; this project's seeded altar catalog (Phase 6 scope) is a handful of products, so one
 * fetch + client-side filtering avoids a network round-trip on every tab/chip click with no
 * realistic payload-size downside. Revisit if the catalog grows substantially.
 */
export function useAltarCatalog() {
  const [models, setModels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [styles, setStyles] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [modelsPage, groupsPage, stylesPage, feedItems] = await Promise.all([
          publicGet("/altar-models", { size: 100 }),
          publicGet("/altar-item-groups", { size: 100 }),
          publicGet("/altar-styles", { size: 100 }),
          publicGet("/altar-customizer/items"),
        ]);
        if (cancelled) return;
        setModels((modelsPage?.content || []).filter((model) => model.isActive !== false));
        setGroups((groupsPage?.content || []).filter((group) => group.isActive !== false));
        setStyles((stylesPage?.content || []).filter((style) => style.isActive !== false));
        setItems(Array.isArray(feedItems) ? feedItems : []);
      } catch (requestError) {
        if (cancelled) return;
        setError(
          requestError instanceof PublicApiError
            ? requestError.message
            : "Không thể tải dữ liệu bàn thờ. Vui lòng thử lại.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { models, groups, styles, items, loading, error };
}
