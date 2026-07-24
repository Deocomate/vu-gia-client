import { formatImageUrl } from "@/shared/api/media";

export default function ImageBlock({ block }) {
  if (!block.url) return null;

  return (
    <div className="w-full my-4 flex flex-col gap-2">
      <div className="relative w-full aspect-[430/275] md:aspect-[16/9] rounded-[8px] overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={formatImageUrl(block.url)}
          alt={block.caption || ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      {block.caption && (
        <span className="text-[14px] italic text-[#777E90] text-center">{block.caption}</span>
      )}
    </div>
  );
}
