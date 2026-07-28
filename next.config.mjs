// Backend now serves uploads itself (local filesystem under /files/**), not MinIO.
const DEFAULT_IMAGE_BASE_URL = "http://localhost:8080";
let imageBaseUrl;
try {
  imageBaseUrl = new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL || DEFAULT_IMAGE_BASE_URL);
} catch {
  imageBaseUrl = new URL(DEFAULT_IMAGE_BASE_URL);
}
const { protocol, hostname, port } = imageBaseUrl;

// Backend origin the browser is allowed to call — derived the same way as
// the image host above, so this stays correct across environments without a
// second hardcoded URL to keep in sync.
let apiOrigin;
try {
  apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api").origin;
} catch {
  apiOrigin = "http://localhost:8080";
}

// Defense-in-depth CSP (Phase 2 RT-E): the storefront persists a short-lived
// access token + user PII in localStorage (the backend contract returns the
// access token in the JSON body, so there's no httpOnly option for it) — this
// header bounds an XSS payload's blast radius by refusing to load/exfiltrate
// to any origin other than this app, the backend API, and Google Sign-In.
// `'unsafe-inline'`/`'unsafe-eval'` stay necessary for Next.js's own inline
// hydration scripts and dev-mode HMR; they don't weaken the connect-src/
// frame-ancestors containment that actually matters for token exfiltration.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://accounts.google.com https://accounts.google.com/gsi/client`,
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",
  `img-src 'self' data: blob: ${imageBaseUrl.origin} https://accounts.google.com https://*.googleusercontent.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} https://accounts.google.com`,
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: protocol.replace(":", ""), hostname, port: port || "" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // The built-in optimizer fetches remote images server-side, from inside
    // this app's own container — it always uses the same public image host as
    // the browser (there's no separate internal-URL override for it, unlike
    // API calls). That's fine once deployed with a real, mutually-resolvable
    // domain, but "localhost" is per-container-relative and can't work across
    // separate Docker containers. Set NEXT_IMAGE_UNOPTIMIZED=1 (local/dev only
    // — see docker-compose.local.yml) to skip optimization and let the browser
    // fetch images directly instead. Never set this in production.
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "1",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
    ];
  },
  // Phase 5 decision D2: admin-uploaded altar overlay images are served absolute
  // (`${imageBaseUrl.origin}/files/...`, see WebStorageConfig/StorageUrlSerializer on the
  // backend) — cross-origin from this client, which taints any <canvas> that draws them and
  // makes `toDataURL()` throw a SecurityError the first time a real (non-seed) overlay is
  // composed. Proxying /files/** through this app's own origin (same env var/default as
  // `imageBaseUrl` above, so there's exactly one place that knows the backend's file-serving
  // origin) turns every such URL same-origin once `formatImageUrl()` (shared/api/media.js)
  // rewrites it to the relative form below. Rejected alternative: CORS headers on /files/** —
  // deliberately not used because that depends on getting an origin allow-list right in every
  // environment, whereas this rewrite can't silently regress per-environment.
  async rewrites() {
    return [{ source: "/files/:path*", destination: `${imageBaseUrl.origin}/files/:path*` }];
  },
};

export default nextConfig;
