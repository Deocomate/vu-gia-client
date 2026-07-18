export default function ParagraphBlock({ block }) {
  if (!block.text) return null;
  return (
    <p className="font-normal text-[#383838] text-[16px] leading-[26px] text-justify">
      {block.text}
    </p>
  );
}
