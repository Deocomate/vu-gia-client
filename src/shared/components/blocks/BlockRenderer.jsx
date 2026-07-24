import { useMemo } from "react";
import { parseBlockDoc, BLOCK_TYPES } from "@/shared/components/blocks/schema";
import ParagraphBlock from "@/shared/components/blocks/renderers/ParagraphBlock";
import HeadingBlock from "@/shared/components/blocks/renderers/HeadingBlock";
import ImageBlock from "@/shared/components/blocks/renderers/ImageBlock";
import ImageGridBlock from "@/shared/components/blocks/renderers/ImageGridBlock";
import QuoteBlock from "@/shared/components/blocks/renderers/QuoteBlock";
import ListSectionBlock from "@/shared/components/blocks/renderers/ListSectionBlock";
import DividerBlock from "@/shared/components/blocks/renderers/DividerBlock";

const RENDERERS = {
  [BLOCK_TYPES.PARAGRAPH]: ParagraphBlock,
  [BLOCK_TYPES.HEADING]: HeadingBlock,
  [BLOCK_TYPES.IMAGE]: ImageBlock,
  [BLOCK_TYPES.IMAGE_GRID]: ImageGridBlock,
  [BLOCK_TYPES.QUOTE]: QuoteBlock,
  [BLOCK_TYPES.LIST_SECTION]: ListSectionBlock,
  [BLOCK_TYPES.DIVIDER]: DividerBlock,
};

export default function BlockRenderer({ value, className }) {
  const { blocks } = useMemo(() => parseBlockDoc(value), [value]);
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block) => {
        const Renderer = RENDERERS[block.type];
        return Renderer ? <Renderer key={block.id} block={block} /> : null;
      })}
    </div>
  );
}
