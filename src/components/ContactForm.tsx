"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-200" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-slate-200" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-slate-200" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-slate-200" htmlFor="message">
          What do you need help with?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-emerald-400/90 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
      {status === "success" && (
        <p className="text-sm text-emerald-300">Thanks! We’ll reach out within one business day.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Email hello@velocitybuilders.io instead.</p>
      )}
    </form>
  );
}
