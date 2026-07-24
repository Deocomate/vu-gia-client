export default function HeadingBlock({ block }) {
  if (!block.text) return null;

  if (block.level === 3) {
    return (
      <h3 className="text-[20px] font-semibold text-[#101828] leading-[28px] font-inter mt-4">
        {block.text}
      </h3>
    );
  }

  return (
    <h2 className="text-[24px] font-semibold text-[#101828] leading-[32px] font-inter mt-4">
      {block.text}
    </h2>
  );
}
