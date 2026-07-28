import AltarPresetBuilder from "@/features/admin/altar/altar-preset-builder";

export default async function AdminAltarPresetDetailRoute({ params }) {
  const { id } = await params;
  return <AltarPresetBuilder presetId={id} />;
}
