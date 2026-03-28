"use client";

const TONE_STYLES: Record<string, { wrapper: string; icon: string }> = {
  info:    { wrapper: "bg-blue-50 border-blue-400 text-blue-900",   icon: "ℹ️" },
  warning: { wrapper: "bg-yellow-50 border-yellow-400 text-yellow-900", icon: "⚠️" },
  success: { wrapper: "bg-green-50 border-green-400 text-green-900", icon: "✅" },
  tip:     { wrapper: "bg-purple-50 border-purple-400 text-purple-900", icon: "💡" },
};

export function Callout({ value }: { value: { tone?: string; title?: string; body?: string } }) {
  const tone = value.tone || "info";
  const style = TONE_STYLES[tone] || TONE_STYLES.info;

  // Split on bullet separator · or newline for list rendering
  const body = value.body || "";
  const items = body.split(/\s*·\s*|\n/).map(s => s.trim()).filter(Boolean);
  const isList = items.length > 1;

  return (
    <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 ${style.wrapper}`}>
      {value.title && (
        <p className="font-semibold text-sm mb-2">
          {style.icon} {value.title}
        </p>
      )}
      {isList ? (
        <ul className="space-y-1 text-[15px] leading-relaxed list-none pl-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-[3px] text-current opacity-50 shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] leading-relaxed">{body}</p>
      )}
    </div>
  );
}
