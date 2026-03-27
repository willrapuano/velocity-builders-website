"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ value }: { value: { items?: AccordionItem[] } }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = value.items || [];

  return (
    <div className="my-8 divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.question}</span>
            <svg
              className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-4 transition-transform ${open === i ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-gray-700 text-[16px] leading-relaxed bg-white">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
