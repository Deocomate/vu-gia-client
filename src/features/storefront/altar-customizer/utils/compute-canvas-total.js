/**
 * Sums placed-item prices + accessory line totals (`price * quantity`) into a single grand
 * total — the number shown on-screen in `altar-customizer-summary.jsx`, snapshotted into a saved
 * design's `totalPrice` (phase 5 save-to-library), and rendered as the exported HTML's grand
 * total (phase 5 download). One implementation, every caller agrees.
 *
 * Pure, no DOM/React dependency — safe to unit-test directly in Node.
 */
export function computeCanvasTotal({ items = [], accessories = [] } = {}) {
  const itemsTotal = (items || []).reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
  const accessoriesTotal = (accessories || []).reduce(
    (sum, accessory) => sum + (Number(accessory?.price) || 0) * (Number(accessory?.quantity) || 0),
    0,
  );
  return itemsTotal + accessoriesTotal;
}
