import { describe, expect, it } from "vitest";
import { buildAltarExportFilename, buildAltarExportHtml, escapeHtml } from "./build-altar-export-html";

describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("coerces null/undefined to an empty string", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("passes plain text through unchanged", () => {
    expect(escapeHtml("Bát hương gốm men lam")).toBe("Bát hương gốm men lam");
  });
});

describe("buildAltarExportHtml", () => {
  it("escapes a malicious product name instead of emitting it literally (XSS surface)", () => {
    const html = buildAltarExportHtml({
      imageDataUrl: "data:image/png;base64,AAAA",
      lines: [{ name: "<script>alert(1)</script>", price: 100000, quantity: 1 }],
      grandTotal: 100000,
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("escapes a malicious sizeLabel the same way", () => {
    const html = buildAltarExportHtml({
      imageDataUrl: "data:image/png;base64,AAAA",
      lines: [{ name: "Ok", sizeLabel: '"><img src=x onerror=alert(1)>', price: 1, quantity: 1 }],
      grandTotal: 1,
    });
    expect(html).not.toContain('"><img src=x onerror=alert(1)>');
  });

  it("includes the composed image data URI, item rows, and the grand total", () => {
    const html = buildAltarExportHtml({
      imageDataUrl: "data:image/png;base64,AAAA",
      lines: [{ name: "Bát hương", sizeLabel: "40x60cm", price: 200000, quantity: 2 }],
      grandTotal: 400000,
    });
    expect(html).toContain("data:image/png;base64,AAAA");
    expect(html).toContain("Bát hương");
    expect(html).toContain("400.000đ");
  });

  it("has no external network resources (offline requirement)", () => {
    const html = buildAltarExportHtml({
      imageDataUrl: "data:image/png;base64,AAAA",
      lines: [{ name: "X", price: 1, quantity: 1 }],
      grandTotal: 1,
    });
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<link/i);
  });
});

describe("buildAltarExportFilename", () => {
  it("formats as ban-tho-vu-gia-{yyyyMMdd-HHmm}.html in local time", () => {
    const date = new Date(2026, 6, 28, 9, 5); // 2026-07-28 09:05 local
    expect(buildAltarExportFilename(date)).toBe("ban-tho-vu-gia-20260728-0905.html");
  });
});
