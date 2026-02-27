import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/legal", label: "Legal" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Velocity Builders
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full border border-emerald-400 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-400/10"
        >
          Work With Us
        </Link>
      </div>
    </header>
  );
}
