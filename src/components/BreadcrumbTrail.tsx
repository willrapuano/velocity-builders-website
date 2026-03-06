import Link from "next/link";

type Crumb = {
  name: string;
  path: string;
};

export function BreadcrumbTrail({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-white">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-emerald-300">
                  {crumb.name}
                </Link>
              )}
              {!isLast ? <span className="text-slate-500">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
