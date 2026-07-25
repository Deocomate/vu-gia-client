export default function HeadingBlock({ block }) {
  if (!block.text) return null;

  if (block.level === 3) {
    return (
      <h3 className="font-montserrat text-[18px] lg:text-[26px] font-[600] mt-1 text-black leading-[22px] break-words mb-4 lg:mb-5">
        {block.text}
      </h3>
    );
  }

  return (
    <h2 className="font-montserrat text-[20px] lg:text-[32px] font-[600] mt-1 text-black leading-[24px] break-words mb-5 lg:mb-6">
      {block.text}
    </h2>
  );
}
