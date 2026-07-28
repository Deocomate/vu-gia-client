"use client";

import { useCallback, useReducer } from "react";
import {
  altarCanvasCoreReducer,
  createInitialCanvasState,
} from "./use-altar-canvas-reducer-core";

// Re-export every pure helper so existing importers (the reducer's own test file, the designer
// panel) keep working against this single module path — the pure/testable logic itself lives in
// `use-altar-canvas-reducer-core.js` (no React import, see that file's docblock for why).
export {
  altarCanvasCoreReducer,
  computeBringToFrontZ,
  computeSendToBackZ,
  createInitialCanvasState,
  makeInstanceId,
  mapPresetToCanvasState,
} from "./use-altar-canvas-reducer-core";

const HISTORY_LIMIT = 50;

function createInitialHistoryState(present) {
  return { past: [], present, future: [], lastMoveSignature: null };
}

/**
 * Wraps `altarCanvasCoreReducer` with bounded (cap `HISTORY_LIMIT`) undo/redo. Consecutive
 * `move` actions on the *same* instance are coalesced into a single history entry — otherwise
 * every `pointermove` during one drag gesture would consume its own undo step, making undo
 * useless for dragging (the reducer only receives a `move` action per pointer event, no separate
 * drag-start/drag-end action, so coalescing is the only way to make one drag = one undo step).
 * `select` never touches history — it isn't user-visible "content" worth undoing.
 */
export function altarCanvasHistoryReducer(historyState, action) {
  if (action.type === "undo") {
    if (historyState.past.length === 0) return historyState;
    const previous = historyState.past[historyState.past.length - 1];
    return {
      past: historyState.past.slice(0, -1),
      present: previous,
      future: [historyState.present, ...historyState.future].slice(0, HISTORY_LIMIT),
      lastMoveSignature: null,
    };
  }

  if (action.type === "redo") {
    if (historyState.future.length === 0) return historyState;
    const [next, ...rest] = historyState.future;
    return {
      past: [...historyState.past, historyState.present].slice(-HISTORY_LIMIT),
      present: next,
      future: rest,
      lastMoveSignature: null,
    };
  }

  const nextPresent = altarCanvasCoreReducer(historyState.present, action);
  if (nextPresent === historyState.present) return historyState;

  if (action.type === "select") {
    return { ...historyState, present: nextPresent };
  }

  const moveSignature = action.type === "move" ? `move:${action.instanceId}` : null;
  if (moveSignature && moveSignature === historyState.lastMoveSignature) {
    return { ...historyState, present: nextPresent };
  }

  return {
    past: [...historyState.past, historyState.present].slice(-HISTORY_LIMIT),
    present: nextPresent,
    future: [],
    lastMoveSignature: moveSignature,
  };
}

/**
 * `useReducer` wrapper exposing the canvas state plus convenience action creators (one per
 * reducer action, all `useCallback`-stable) — see `use-altar-canvas-reducer-core.js`'s docblock
 * for the full state shape this hook manages.
 */
export function useAltarCanvasReducer(initialSelections) {
  const [history, dispatch] = useReducer(
    altarCanvasHistoryReducer,
    initialSelections,
    (init) => createInitialHistoryState(createInitialCanvasState(init)),
  );

  const add = useCallback((feedItem) => dispatch({ type: "add", feedItem }), []);
  const addAccessory = useCallback((feedItem) => dispatch({ type: "addAccessory", feedItem }), []);
  const removeAccessory = useCallback((productId) => dispatch({ type: "removeAccessory", productId }), []);
  const move = useCallback(
    ({ instanceId, x, y }) => dispatch({ type: "move", instanceId, x, y }),
    [],
  );
  const select = useCallback((instanceId) => dispatch({ type: "select", instanceId }), []);
  const remove = useCallback((instanceId) => dispatch({ type: "remove", instanceId }), []);
  const flip = useCallback((instanceId) => dispatch({ type: "flip", instanceId }), []);
  const mirror = useCallback((instanceId) => dispatch({ type: "mirror", instanceId }), []);
  const center = useCallback((instanceId) => dispatch({ type: "center", instanceId }), []);
  const setZ = useCallback(
    (instanceId, zIndexOverride) => dispatch({ type: "setZ", instanceId, zIndexOverride }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const loadPreset = useCallback(
    ({ presetId, items, accessories }) => dispatch({ type: "loadPreset", presetId, items, accessories }),
    [],
  );
  const changeSize = useCallback(
    ({ altarModelId, altarSizeId, altarStyleId }) =>
      dispatch({
        type: "changeSize",
        ...(altarModelId !== undefined ? { altarModelId } : {}),
        ...(altarSizeId !== undefined ? { altarSizeId } : {}),
        ...(altarStyleId !== undefined ? { altarStyleId } : {}),
      }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  return {
    state: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    dispatch,
    actions: {
      add,
      addAccessory,
      removeAccessory,
      move,
      select,
      remove,
      flip,
      mirror,
      center,
      setZ,
      clear,
      loadPreset,
      changeSize,
      undo,
      redo,
    },
  };
}
