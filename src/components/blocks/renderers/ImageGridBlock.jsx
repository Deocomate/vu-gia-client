import { formatImageUrl } from "@/lib/media";

export default function ImageGridBlock({ block }) {
  const images = (block.images || []).filter((image) => image?.url);
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formatImageUrl(image.url)}
              alt={image.caption || ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {image.caption && (
            <span className="text-[13px] italic text-[#777E90]">{image.caption}</span>
          )}
        </div>
      ))}
    </div>
  );
}
