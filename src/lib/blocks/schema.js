/**
 * Flat block-content schema shared by admin BlockBuilder (writer) and the
 * storefront BlockRenderer (reader). Matches the backend seed convention
 * (`{"blocks":[{"type":"paragraph","text":"..."}]}`) rather than Editor.js's
 * nested `{time, blocks:[{type,data}], version}` shape.
 */

export const BLOCK_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING: "heading",
  IMAGE: "image",
  IMAGE_GRID: "image-grid",
  QUOTE: "quote",
  LIST_SECTION: "list-section",
  DIVIDER: "divider",
};

export const BLOCK_TYPE_LABELS = {
  [BLOCK_TYPES.PARAGRAPH]: "Đoạn văn",
  [BLOCK_TYPES.HEADING]: "Tiêu đề",
  [BLOCK_TYPES.IMAGE]: "Ảnh",
  [BLOCK_TYPES.IMAGE_GRID]: "Lưới ảnh (2 ảnh)",
  [BLOCK_TYPES.QUOTE]: "Trích dẫn",
  [BLOCK_TYPES.LIST_SECTION]: "Danh sách có tiêu đề",
  [BLOCK_TYPES.DIVIDER]: "Đường kẻ ngang",
};

export const BLOCK_TYPE_LIST = Object.values(BLOCK_TYPES);

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyBlock(type) {
  const id = makeId();
  switch (type) {
    case BLOCK_TYPES.PARAGRAPH:
      return { id, type, text: "" };
    case BLOCK_TYPES.HEADING:
      return { id, type, text: "", level: 2 };
    case BLOCK_TYPES.IMAGE:
      return { id, type, url: "", caption: "" };
    case BLOCK_TYPES.IMAGE_GRID:
      return { id, type, images: [] };
    case BLOCK_TYPES.QUOTE:
      return { id, type, text: "" };
    case BLOCK_TYPES.LIST_SECTION:
      return { id, type, title: "", items: [] };
    case BLOCK_TYPES.DIVIDER:
      return { id, type };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}

const EMPTY_DOC = { blocks: [] };

/**
 * Accepts a string or object, returns `{ blocks: [] }` on empty/null, and
 * `{ blocks: null, malformed: true }` on unparseable JSON. Blocks without an
 * `id` (e.g. seed data) get a deterministic index-based one backfilled, so
 * repeated parses of the same input produce stable React/dnd-kit keys
 * instead of a fresh random id (and remount) on every render.
 */
export function parseBlockDoc(value) {
  if (!value) return EMPTY_DOC;

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return { blocks: null, malformed: true };
    }
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.blocks)) {
    return EMPTY_DOC;
  }

  return {
    blocks: parsed.blocks.map((block, index) =>
      block?.id ? block : { ...block, id: `seed-${index}` },
    ),
  };
}
