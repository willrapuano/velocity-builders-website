import type { EngagementModel } from "@/data/site";

export function EngagementCard({ title, summary, deliverables, timeline }: EngagementModel) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">{timeline}</p>
      <h3 className="mt-3 text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
