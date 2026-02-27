import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Velocity Builders, LLC. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/legal" className="transition hover:text-white">
            Legal
          </Link>
          <a href="mailto:hello@velocitybuilders.io" className="transition hover:text-white">
            hello@velocitybuilders.io
          </a>
        </div>
      </div>
    </footer>
  );
}
