export default function ListSectionBlock({ block }) {
  const items = (block.items || []).filter((item) => item?.text || item?.label);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 pl-4 border-l-2 border-[#ECDAD1] py-1">
      {block.title && <p className="font-semibold text-[#97400C]">{block.title}</p>}
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          {item.label && <p className="font-semibold text-[#97400C]">{item.label}</p>}
          {item.text && (
            <p className="font-normal text-[#383838] text-[16px] leading-[28px] text-justify">
              {item.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
