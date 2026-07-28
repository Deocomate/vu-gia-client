import { describe, expect, it } from "vitest";
import { formatImageUrl } from "./media";

// Covers decision D2 (Phase 5 "Image origin" — see the plan's phase-05 doc): the highest-risk
// piece of code in the plan, per its own risk assessment, because it passes silently on seeded
// same-origin demo images and only breaks the first time a real admin-uploaded overlay is
// composed on a <canvas>. NEXT_PUBLIC_IMAGE_BASE_URL is unset in the test environment, so
// formatImageUrl's default backend origin is "http://localhost:8080" (matches
// next.config.mjs's/WebStorageConfig's own default).
describe("formatImageUrl", () => {
  it("rewrites an absolute backend-origin /files/... URL to a same-origin relative path", () => {
    expect(formatImageUrl("http://localhost:8080/files/altar-designs/thumb-1.png")).toBe(
      "/files/altar-designs/thumb-1.png",
    );
  });

  it("leaves a backend-origin URL that is NOT under /files/ untouched (falls through unchanged)", () => {
    expect(formatImageUrl("http://localhost:8080/other/path.png")).toBe(
      "http://localhost:8080/other/path.png",
    );
  });

  it("leaves a third-party absolute URL untouched", () => {
    expect(formatImageUrl("https://cdn.example.com/files/x.png")).toBe(
      "https://cdn.example.com/files/x.png",
    );
  });

  it("leaves a data: URI untouched", () => {
    const dataUrl = "data:image/png;base64,AAAA";
    expect(formatImageUrl(dataUrl)).toBe(dataUrl);
  });

  it("leaves an already-relative absolute path untouched", () => {
    expect(formatImageUrl("/files/altar-designs/thumb-1.png")).toBe("/files/altar-designs/thumb-1.png");
  });

  it("resolves a bare seed-data relative path against this app's own public/ (unchanged prior behavior)", () => {
    expect(formatImageUrl("assets/images/products/x.png")).toBe("/assets/images/products/x.png");
  });

  it("returns an empty string for falsy input", () => {
    expect(formatImageUrl("")).toBe("");
    expect(formatImageUrl(null)).toBe("");
    expect(formatImageUrl(undefined)).toBe("");
  });
});
