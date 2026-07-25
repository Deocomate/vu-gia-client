import HeadingEditor from "@/shared/components/blocks/editor/editors/heading-editor";
import ImageEditor from "@/shared/components/blocks/editor/editors/image-editor";
import RichParagraphEditor from "@/shared/components/category-blocks/editors/rich-paragraph-editor";
import {
  CATEGORY_BLOCK_TYPES,
  CATEGORY_BLOCK_TYPE_LIST,
  CATEGORY_BLOCK_TYPE_LABELS,
  createEmptyCategoryBlock,
} from "@/shared/components/category-blocks/schema";

/** `registry` prop for the generalized `BlockBuilder` shell (see blocks/editor/block-builder.jsx). */
export const categoryBlockRegistry = {
  blockTypeList: CATEGORY_BLOCK_TYPE_LIST,
  blockTypeLabels: CATEGORY_BLOCK_TYPE_LABELS,
  createEmptyBlock: createEmptyCategoryBlock,
  editors: {
    [CATEGORY_BLOCK_TYPES.RICH_PARAGRAPH]: RichParagraphEditor,
    [CATEGORY_BLOCK_TYPES.HEADING]: HeadingEditor,
    [CATEGORY_BLOCK_TYPES.IMAGE]: ImageEditor,
  },
};
