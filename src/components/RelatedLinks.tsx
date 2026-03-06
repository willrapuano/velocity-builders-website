import Link from "next/link";

type LinkItem = {
  href: string;
  label: string;
  description?: string;
};

export function RelatedLinks({ title, links }: { title: string; links: LinkItem[] }) {
  if (!links.length) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-emerald-300/70"
            >
              <p className="font-medium text-emerald-300">{item.label}</p>
              {item.description ? <p className="mt-2 text-sm text-slate-300">{item.description}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
