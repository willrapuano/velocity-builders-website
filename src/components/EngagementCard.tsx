import type { EngagementModel } from "@/data/site";

export function EngagementCard({ title, summary, deliverables, timeline }: EngagementModel) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">{timeline}</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-100/90">
        {deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
