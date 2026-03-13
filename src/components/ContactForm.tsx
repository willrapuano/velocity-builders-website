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
        <label className="text-sm font-medium text-gray-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          placeholder="Your company or team name"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700" htmlFor="message">
          What do you need help with?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          placeholder="Tell us about your pipeline, biggest challenges, or what you'd like to fix..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Get My Growth Blueprint"}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-600 font-medium text-center">
          ✓ Thanks! We&apos;ll reach out within one business day.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 text-center">Something went wrong. Email hello@velocity-builders.com instead.</p>
      )}
    </form>
  );
}
