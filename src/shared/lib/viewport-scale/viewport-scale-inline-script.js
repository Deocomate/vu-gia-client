// Constants below mirror viewport-scale-config.js (DESIGN_WIDTH, MIN_SCALE, MAX_SCALE,
// MIN_VIEWPORT, ADMIN_PATH_PREFIX) — duplicated because this runs as a raw pre-paint
// <script> string, before any module graph is available. Keep values in sync.
export function getViewportScaleInlineScript() {
  return `(function () {
  try {
    if (!('zoom' in document.documentElement.style)) return;
    var W = 1920, MIN = 0.82, MAX = 1.0, MINVP = 1280, ADMIN = '/admin';
    var path = location.pathname;
    if (path === ADMIN || path.indexOf(ADMIN + '/') === 0) return;
    var iw = window.innerWidth;
    var s = iw < MINVP ? 1 : Math.min(MAX, Math.max(MIN, iw / W));
    document.documentElement.style.zoom = s === 1 ? '' : String(s);
  } catch (e) {}
})();`;
}
