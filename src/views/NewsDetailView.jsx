import PagePlaceholder from "@/views/PagePlaceholder";

export default function NewsDetailView({ slug }) {
  return (
    <PagePlaceholder
      description="Nội dung bài viết chi tiết sẽ được kết nối dữ liệu ở giai đoạn sau."
      eyebrow="Tin tức chi tiết"
      slug={slug}
      title="Chi tiết tin tức"
    />
  );
}
