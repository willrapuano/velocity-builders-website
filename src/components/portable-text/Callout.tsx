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

  const body = value.body || "";
  const items = body.split(/\s*·\s*|\n/).map(s => s.trim()).filter(Boolean);
  const isList = items.length > 1;

  // If first item ends with ':', it's an intro sentence — render separately above the list
  const hasIntro = isList && items[0].endsWith(":");
  const intro = hasIntro ? items[0] : null;
  const listItems = hasIntro ? items.slice(1) : items;
  // Detect closing sentence: long last item when bullets are short
  const avgBulletLen = listItems.slice(0, -1).reduce((s, i) => s + i.length, 0) / Math.max(listItems.length - 1, 1);
  const lastItem = listItems[listItems.length - 1];
  const hasOutro = listItems.length > 1 && lastItem && lastItem.length > 80 && avgBulletLen < 80;
  const outro = hasOutro ? lastItem : null;
  const bulletItems = hasOutro ? listItems.slice(0, -1) : listItems;

  return (
    <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 ${style.wrapper}`}>
      {value.title && (
        <p className="font-semibold text-sm mb-2">
          {style.icon} {value.title}
        </p>
      )}
      {isList ? (
        <div className="space-y-2 text-[15px] leading-relaxed">
          {intro && <p className="mb-1">{intro}</p>}
          <ul className="space-y-1 list-none pl-0">
            {bulletItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-[3px] text-current opacity-50 shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {outro && <p className="mt-2">{outro}</p>}
        </div>
      ) : (
        <p className="text-[15px] leading-relaxed">{body}</p>
      )}
    </div>
  );
}
