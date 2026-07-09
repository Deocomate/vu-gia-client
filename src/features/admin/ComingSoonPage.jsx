import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function ComingSoonPage({ title }) {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        API required
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-zinc-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        Database đã có model tương ứng, nhưng backend hiện chưa expose endpoint admin cho module này.
        Khi có `admin/users` hoặc `admin/reviews`, màn này có thể nối vào CRUD engine hiện tại.
      </p>
      <Link
        href={ROUTES.ADMIN}
        className="mt-6 inline-flex h-11 items-center bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Về dashboard
      </Link>
    </div>
  );
}
