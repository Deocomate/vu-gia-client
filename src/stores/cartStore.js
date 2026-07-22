"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartService from "@/features/cart/cart-service";
import { formatImageUrl } from "@/lib/media";
import { toast } from "@/utils/feedback";

// ---------------------------------------------------------------------------
// Cart store — dual-mode (Phase 3):
//
// - `mode: "guest"` — pre-login, local-only. `items` is the legacy ad-hoc
//   shape `{ id, title, sku, price, image, quantity, classification,
//   packSize }`, keyed by the REAL numeric backend product id (RT-A — no
//   more mock string ids). Guest reducers (`addItem`/`updateQuantity`/
//   `removeItem`/`clearCart`/`totalCount`/`subtotal`) are untouched from the
//   pre-Phase-3 implementation.
// - `mode: "server"` — authenticated, API-synced. `items` holds the raw
//   `CartItemResponse[]` from `vu-gia-backend-api` (CART_API.md §4), keyed by
//   cart-line id. Every mutation calls the Cart API then reconciles the WHOLE
//   store from the response (`hydrateFromServer`) — the server is always the
//   source of truth for price/quantity/totals.
//
// UI components should read through `@/features/cart/cart-view-model.js`'s
// `toCartLineVMList(items, mode)` rather than branching on `mode` themselves.
// ---------------------------------------------------------------------------

/**
 * Recoverable Cart API error codes (CART_API.md §2): the referenced product
 * or cart line no longer exists / isn't the caller's. Both are handled the
 * same way — resync from the server and tell the user, never crash.
 */
const RECOVERABLE_ERROR_CODES = new Set([4044, 4058]);

async function recoverFromCartError(get, error) {
  const recoverable = RECOVERABLE_ERROR_CODES.has(error?.code);

  if (recoverable) {
    try {
      const cart = await cartService.getCart();
      get().hydrateFromServer(cart);
    } catch {
      // Resync itself failed (e.g. offline) — nothing more we can safely do
      // locally; the optimistic rollback already happened in the caller.
    }
    toast.error(
      error.code === 4044
        ? "Sản phẩm không còn tồn tại. Giỏ hàng đã được cập nhật lại."
        : "Không tìm thấy dòng sản phẩm này trong giỏ hàng. Giỏ hàng đã được cập nhật lại.",
    );
  } else {
    toast.error(error?.message || "Không thể cập nhật giỏ hàng. Vui lòng thử lại.");
  }
}

/**
 * Runs a server cart mutation optimistically: applies `optimisticItems`
 * immediately, calls `action()`, and on success reconciles from the full
 * cart it returns. On failure, rolls back to the pre-mutation snapshot and
 * surfaces the error (resync + toast for 4044/4058, toast otherwise).
 * Returns `true`/`false` so callers can decide whether to proceed (e.g. only
 * navigate to checkout after a successful add).
 */
async function runOptimisticServerOp(set, get, { pendingId, optimisticItems, action }) {
  const snapshot = get().items;

  set((state) => ({
    items: optimisticItems ? optimisticItems(state.items) : state.items,
    pendingIds: state.pendingIds.includes(pendingId)
      ? state.pendingIds
      : [...state.pendingIds, pendingId],
  }));

  try {
    const cart = await action();
    set((state) => ({ pendingIds: state.pendingIds.filter((id) => id !== pendingId) }));
    get().hydrateFromServer(cart);
    return true;
  } catch (error) {
    set((state) => ({
      items: snapshot,
      pendingIds: state.pendingIds.filter((id) => id !== pendingId),
    }));
    await recoverFromCartError(get, error);
    return false;
  }
}

function mergeMutexKey(userId) {
  return `vugia-cart-merge:${userId}`;
}

function readMergeMutex(userId) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(mergeMutexKey(userId));
  } catch {
    return null; // localStorage unavailable (privacy mode, SSR) — treat as unset
  }
}

function writeMergeMutex(userId, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(mergeMutexKey(userId));
    } else {
      window.localStorage.setItem(mergeMutexKey(userId), value);
    }
  } catch {
    // best-effort — proceeding without a persisted mutex degrades to
    // single-tab-safe only, still correct for the common case.
  }
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      mode: "guest", // "guest" | "server"
      items: [], // guest shape OR raw CartItemResponse[] depending on `mode`
      totalQuantity: 0, // server-authoritative (CART_API.md `CartResponse.totalQuantity`)
      totalAmount: 0, // server-authoritative (CART_API.md `CartResponse.totalAmount`)
      pendingIds: [], // ids currently in-flight (lineId for update/remove, "clear", "add:<productId>")

      // ---- Guest reducers (unchanged from pre-Phase-3 behavior) ----------

      addItem(product, qty = 1) {
        const quantity = Math.max(1, Number(qty) || 1);
        set((state) => {
          const existing = state.items.find((it) => it.id === product.id);
          if (existing) {
            return {
              items: state.items.map((it) =>
                it.id === product.id
                  ? { ...it, quantity: (Number(it.quantity) || 0) + quantity }
                  : it,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                classification: "Mặc định",
                packSize: 1,
                ...product,
                quantity,
              },
            ],
          };
        });
      },

      updateQuantity(id, quantity) {
        set((state) => ({
          items: state.items.map((it) => {
            if (it.id !== id) return it;
            // Allow empty string while the user is editing the input.
            if (quantity === "" || quantity === null) {
              return { ...it, quantity: "" };
            }
            const n = Number(quantity);
            if (Number.isNaN(n)) return it;
            return { ...it, quantity: Math.max(1, n) };
          }),
        }));
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((it) => it.id !== id) }));
      },

      clearCart() {
        set({ items: [] });
      },

      // ---- Mode-aware entry points (what UI call sites should use) -------

      /**
       * Add-to-cart entry point for product-detail/cards: decides guest vs.
       * server based on the current `mode`. `product` must be a real backend
       * `ProductResponse` (real numeric `id` — RT-A). Returns a promise
       * resolving to `true`/`false` (server mode) or `true` (guest, sync).
       */
      addToCart(product, qty = 1) {
        const quantity = Math.max(1, Number(qty) || 1);

        if (!product?.id && product?.id !== 0) {
          console.error("[cart] addToCart called without a real product id — refusing to add.", product);
          toast.error("Không thể thêm sản phẩm này vào giỏ hàng (thiếu mã sản phẩm).");
          return Promise.resolve(false);
        }

        if (get().mode === "server") {
          return get().serverAdd(product.id, quantity);
        }

        get().addItem(
          {
            id: product.id,
            title: product.name,
            sku: product.sku || "",
            price: Number(product.price) || 0,
            image: formatImageUrl(product.thumb),
          },
          quantity,
        );
        return Promise.resolve(true);
      },

      /** Mode-aware quantity change for an existing cart line (VM `id`). */
      updateLineQuantity(lineId, quantity) {
        if (get().mode === "server") return get().serverUpdate(lineId, quantity);
        get().updateQuantity(lineId, quantity);
        return Promise.resolve(true);
      },

      /** Mode-aware line removal (VM `id`). */
      removeLine(lineId) {
        if (get().mode === "server") return get().serverRemove(lineId);
        get().removeItem(lineId);
        return Promise.resolve(true);
      },

      /** Mode-aware full-cart clear. */
      clearAllItems() {
        if (get().mode === "server") return get().serverClear();
        get().clearCart();
        return Promise.resolve(true);
      },

      isPending(id) {
        return get().pendingIds.includes(id);
      },

      // ---- Server actions (authenticated) ---------------------------------

      /**
       * `POST /api/cart/items` — additive server-side (same product
       * accumulates onto its existing line). Optimistically bumps/creates a
       * local row, then reconciles from the server's full cart.
       */
      async serverAdd(productId, quantity = 1, comboItems) {
        const qty = Math.max(1, Number(quantity) || 1);
        return runOptimisticServerOp(set, get, {
          pendingId: `add:${productId}`,
          optimisticItems: (items) => {
            const existing = items.find((it) => it.productId === productId);
            if (existing) {
              return items.map((it) =>
                it.productId === productId
                  ? { ...it, quantity: (Number(it.quantity) || 0) + qty }
                  : it,
              );
            }
            // Optimistic placeholder — replaced wholesale by the server's
            // authoritative row once `hydrateFromServer` runs.
            return [
              ...items,
              {
                id: `optimistic-${productId}`,
                productId,
                productName: "",
                productThumb: "",
                productSlug: "",
                unitPrice: 0,
                quantity: qty,
                comboItems: comboItems ?? null,
                lineTotal: 0,
              },
            ];
          },
          action: () => cartService.addItem(productId, qty, comboItems),
        });
      },

      /** `PUT /api/cart/items/{itemId}` — sets an absolute quantity. */
      async serverUpdate(lineId, quantity) {
        const qty = Math.max(1, Number(quantity) || 1);
        return runOptimisticServerOp(set, get, {
          pendingId: lineId,
          optimisticItems: (items) =>
            items.map((it) =>
              it.id === lineId
                ? { ...it, quantity: qty, lineTotal: (Number(it.unitPrice) || 0) * qty }
                : it,
            ),
          action: () => cartService.updateItem(lineId, qty),
        });
      },

      /** `DELETE /api/cart/items/{itemId}`. */
      async serverRemove(lineId) {
        return runOptimisticServerOp(set, get, {
          pendingId: lineId,
          optimisticItems: (items) => items.filter((it) => it.id !== lineId),
          action: () => cartService.removeItem(lineId),
        });
      },

      /** `DELETE /api/cart` — empties the whole cart. */
      async serverClear() {
        return runOptimisticServerOp(set, get, {
          pendingId: "clear",
          optimisticItems: () => [],
          action: () => cartService.clearCart(),
        });
      },

      /** Reconciles the whole store from a `CartResponse` (CART_API.md §4). */
      hydrateFromServer(cart) {
        set({
          mode: "server",
          items: cart?.items || [],
          totalQuantity: cart?.totalQuantity || 0,
          totalAmount: cart?.totalAmount || 0,
        });
      },

      /**
       * Converges the local guest cart into the server cart on login
       * (RT-B/RT-C). Idempotent + cross-tab-safe via a persisted mutex
       * (`vugia-cart-merge:<userId>` in `localStorage`):
       *
       * - `"running"` → another call/tab is actively merging right now, bail.
       * - `"done"` → already converged before; just resync (cheap GET, safe
       *   to repeat on every reload/tab — never re-sends guest lines).
       * - unset → first time for this user: set `"running"`, compute each
       *   guest product's ABSOLUTE target quantity (existing server qty +
       *   guest qty) once, `POST` new lines / `PUT` existing lines to that
       *   target, clearing each guest line right after its OWN success (a
       *   crash partway through leaves only the unsynced remainder — a retry
       *   only touches what's left). Marks `"done"` on completion.
       */
      async mergeGuestCartToServer(userId) {
        if (userId == null) return;

        const flag = readMergeMutex(userId);

        if (flag === "running") {
          return;
        }

        if (flag === "done") {
          try {
            const cart = await cartService.getCart();
            get().hydrateFromServer(cart);
          } catch (error) {
            await recoverFromCartError(get, error);
          }
          return;
        }

        writeMergeMutex(userId, "running");

        try {
          // RT-A: legacy pre-Phase-3 guest lines may still carry a mock
          // string id (e.g. "dt026") instead of a real numeric productId —
          // drop them rather than sending them to the API.
          const guestItems = get().items.filter((it) => {
            const n = Number(it?.id);
            return Number.isFinite(n) && String(it.id).trim() !== "";
          });
          const droppedCount = get().items.length - guestItems.length;
          if (droppedCount > 0) {
            set((state) => ({ items: state.items.filter((it) => guestItems.includes(it)) }));
            console.warn(
              `[cart] dropped ${droppedCount} legacy guest cart line(s) with a non-numeric id before merge.`,
            );
          }

          let cart = await cartService.getCart();

          for (const guestItem of guestItems) {
            const productId = Number(guestItem.id);
            const guestQty = Math.max(0, Number(guestItem.quantity) || 0);
            if (guestQty <= 0) {
              set((state) => ({ items: state.items.filter((it) => it.id !== guestItem.id) }));
              continue;
            }

            const existingLine = cart.items.find((line) => line.productId === productId);
            const target = (existingLine?.quantity || 0) + guestQty;

            try {
              cart = existingLine
                ? await cartService.updateItem(existingLine.id, target)
                : await cartService.addItem(productId, target);
              // Clear this guest line immediately after its OWN success
              // (RT-B) — not all-at-once at the end.
              set((state) => ({ items: state.items.filter((it) => it.id !== guestItem.id) }));
            } catch (error) {
              if (error?.code === 4044) {
                // Product no longer exists — drop the dead guest line and
                // keep converging the rest instead of aborting the merge.
                set((state) => ({ items: state.items.filter((it) => it.id !== guestItem.id) }));
                toast.error("Một sản phẩm trong giỏ hàng của bạn không còn tồn tại và đã được bỏ qua.");
                continue;
              }
              throw error;
            }
          }

          get().hydrateFromServer(cart);
          writeMergeMutex(userId, "done");
        } catch (error) {
          // Clear (not "done") the mutex so a retry (reload/relogin) can
          // attempt the merge again — safe because it's idempotent: only the
          // still-unsynced remainder of `items` gets touched next time.
          writeMergeMutex(userId, null);
          await recoverFromCartError(get, error);
        }
      },

      /**
       * Reverts to guest mode on logout and clears this user's merge mutex
       * so a future login can converge the guest cart again.
       */
      resetForLogout(userId) {
        if (userId != null) writeMergeMutex(userId, null);
        set({ mode: "guest", items: [], totalQuantity: 0, totalAmount: 0, pendingIds: [] });
      },

      // ---- Derived totals (branch on mode) --------------------------------

      totalCount() {
        const state = get();
        if (state.mode === "server") return state.totalQuantity;
        return state.items.reduce((n, it) => n + (Number(it.quantity) || 0), 0);
      },

      subtotal() {
        const state = get();
        if (state.mode === "server") return state.totalAmount;
        return state.items.reduce(
          (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
          0,
        );
      },
    }),
    {
      name: "vugia-cart",
      // Never persist authenticated server-cart data locally — a reload
      // always restarts from an empty guest snapshot and lets the
      // auth-bootstrap → `mergeGuestCartToServer` resync path (cheap GET,
      // see the "done" branch above) re-establish server mode, so a stale
      // `CartItemResponse[]` shape can never be misread as guest items.
      partialize: (state) => (state.mode === "server" ? { items: [] } : { items: state.items }),
    },
  ),
);
