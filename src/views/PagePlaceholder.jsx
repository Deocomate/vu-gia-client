export default function PagePlaceholder({ eyebrow, title, description, slug }) {
  return (
    <section className="mx-auto min-h-[60vh] max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-950">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
        {description}
      </p>
      {slug ? (
        <p className="mt-6 text-sm text-neutral-500">
          Slug: <span className="font-medium text-neutral-800">{slug}</span>
        </p>
      ) : null}
    </section>
  );
}
