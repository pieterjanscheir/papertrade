import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-5xl font-semibold">404</p>
      <p className="text-muted">That page or asset doesn&apos;t exist.</p>
      <Link href="/markets" className="mt-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg">
        Browse markets
      </Link>
    </div>
  );
}
