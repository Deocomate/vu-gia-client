import { useMemo } from "react";
import { parseBlockDoc, BLOCK_TYPES } from "@/shared/components/blocks/schema";
import ParagraphBlock from "@/shared/components/blocks/renderers/paragraph-block";
import HeadingBlock from "@/shared/components/blocks/renderers/heading-block";
import ImageBlock from "@/shared/components/blocks/renderers/image-block";
import ImageGridBlock from "@/shared/components/blocks/renderers/image-grid-block";
import QuoteBlock from "@/shared/components/blocks/renderers/quote-block";
import ListSectionBlock from "@/shared/components/blocks/renderers/list-section-block";
import DividerBlock from "@/shared/components/blocks/renderers/divider-block";

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
