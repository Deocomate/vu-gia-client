import { absoluteUrl } from "@/shared/lib/seo/siteConfig";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tai-khoan", "/gio-hang", "/thanh-toan"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
