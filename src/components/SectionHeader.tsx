type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-base leading-relaxed text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
