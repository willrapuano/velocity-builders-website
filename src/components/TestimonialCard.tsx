import type { Testimonial } from "@/data/site";

export function TestimonialCard({ quote, name, role, company }: Testimonial) {
  return (
    <figure className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-inner shadow-black/20">
      <blockquote className="text-lg font-medium text-white/90">
        “{quote}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-slate-300">
        <span className="font-semibold text-white">{name}</span> · {role}, {company}
      </figcaption>
    </figure>
  );
}
