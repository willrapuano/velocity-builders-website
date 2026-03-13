import type { Service } from "@/data/site";

export function ServiceCard({ title, description, bullets, cta }: Service) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        <ul className="space-y-2 text-sm text-gray-700">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      {cta && (
        <button className="mt-6 w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-600">
          {cta}
        </button>
      )}
    </div>
  );
}
