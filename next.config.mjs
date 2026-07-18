// Backend now serves uploads itself (local filesystem under /files/**), not MinIO.
const DEFAULT_IMAGE_BASE_URL = "http://localhost:8080";
let imageBaseUrl;
try {
  imageBaseUrl = new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL || DEFAULT_IMAGE_BASE_URL);
} catch {
  imageBaseUrl = new URL(DEFAULT_IMAGE_BASE_URL);
}
const { protocol, hostname, port } = imageBaseUrl;

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
};

export default nextConfig;
