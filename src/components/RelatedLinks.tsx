import Link from "next/link";

type LinkItem = { href: string; label: string; description?: string };

export function RelatedLinks({ title, links }: { title: string; links: LinkItem[] }) {
  if (!links.length) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm">
              <p className="font-medium text-blue-600">{item.label}</p>
              {item.description ? <p className="mt-2 text-sm text-gray-600">{item.description}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
