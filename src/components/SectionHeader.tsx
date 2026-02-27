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
        <p className="text-sm uppercase tracking-[0.3em] text-velvet/70">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-base leading-relaxed text-slate-300 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
