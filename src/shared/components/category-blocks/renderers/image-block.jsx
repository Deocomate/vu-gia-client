import Image from "next/image";
import { formatImageUrl } from "@/shared/api/media";

export default function ImageBlock({ block }) {
  if (!block.url) return null;

  return (
    <div className="relative w-full max-w-[800px] h-[247px] mx-auto rounded-[8px] overflow-hidden mb-6">
      <Image
        src={formatImageUrl(block.url)}
        alt={block.caption || ""}
        fill
        className="object-cover"
        sizes="(max-width: 800px) 100vw, 800px"
      />
    </div>
  );
}
