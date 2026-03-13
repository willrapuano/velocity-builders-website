import Link from "next/link";

type Crumb = { name: string; path: string };

export function BreadcrumbTrail({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-gray-900">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-blue-600">{crumb.name}</Link>
              )}
              {!isLast ? <span className="text-gray-300">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
