export default function QuoteBlock({ block }) {
  if (!block.text) return null;

  return (
    <blockquote className="bg-[#ECDAD1]/30 border-l-4 border-[#97400C] p-5 my-2 rounded-r-[8px] italic font-medium text-[#97400C]">
      "{block.text}"
    </blockquote>
  );
}
