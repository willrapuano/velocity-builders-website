type Stat = { label: string; value: string };

type StatGroupProps = {
  stats: Stat[];
};

export function StatGroup({ stats }: StatGroupProps) {
  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <dt className="text-sm uppercase tracking-[0.25em] text-slate-300">{stat.label}</dt>
          <dd className="mt-2 text-3xl font-bold text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
