/**
 * Block-content schema for category detail-content — separate from
 * `blocks/schema.js` (product/news), themed for the Montserrat storefront
 * typography. Same `{"blocks":[...]}` storage contract; `parseBlockDoc` from
 * `blocks/schema.js` is reused as-is since it only inspects that shape.
 */

export const CATEGORY_BLOCK_TYPES = {
  RICH_PARAGRAPH: "rich-paragraph",
  HEADING: "heading",
  IMAGE: "image",
};

export const CATEGORY_BLOCK_TYPE_LABELS = {
  [CATEGORY_BLOCK_TYPES.RICH_PARAGRAPH]: "Đoạn văn",
  [CATEGORY_BLOCK_TYPES.HEADING]: "Tiêu đề",
  [CATEGORY_BLOCK_TYPES.IMAGE]: "Ảnh",
};

export const CATEGORY_BLOCK_TYPE_LIST = Object.values(CATEGORY_BLOCK_TYPES);

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyCategoryBlock(type) {
  const id = makeId();
  switch (type) {
    case CATEGORY_BLOCK_TYPES.RICH_PARAGRAPH:
      return { id, type, html: "", variant: "body" };
    case CATEGORY_BLOCK_TYPES.HEADING:
      return { id, type, text: "", level: 2 };
    case CATEGORY_BLOCK_TYPES.IMAGE:
      return { id, type, url: "", caption: "" };
    default:
      throw new Error(`Unknown category block type: ${type}`);
  }
}
