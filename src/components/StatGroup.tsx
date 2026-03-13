type Stat = { label: string; value: string };

export function StatGroup({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
          <dt className="text-sm uppercase tracking-[0.25em] text-gray-500">{stat.label}</dt>
          <dd className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
