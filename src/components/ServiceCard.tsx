import type { Service } from "@/data/site";

export function ServiceCard({ title, description, bullets, cta }: Service) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-2xl shadow-black/30">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{description}</p>
        <ul className="space-y-2 text-sm text-slate-200">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      {cta && (
        <button className="mt-6 w-full rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-400 hover:text-emerald-300">
          {cta}
        </button>
      )}
    </div>
  );
}
