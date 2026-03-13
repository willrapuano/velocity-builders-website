import type { Testimonial } from "@/data/site";

export function TestimonialCard({ quote, name, role, company }: Testimonial) {
  return (
    <figure className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
      <blockquote className="text-lg font-medium text-gray-800 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{name}</span> · {role}, {company}
      </figcaption>
    </figure>
  );
}
