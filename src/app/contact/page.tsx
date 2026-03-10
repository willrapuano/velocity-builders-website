import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact Velocity Builders",
  description:
    "Contact Velocity Builders for a growth blueprint: identify pipeline leaks, improve lead response, and automate follow-up to drive more closings.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Contact</p>
        <h1 className="text-4xl font-bold text-white">Tell Us What’s Breaking in Your Pipeline.</h1>
        <p className="text-lg text-slate-300">We reply in 1 business day with a clear plan: what to fix first, what to automate, and what to ignore.</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          <p className="font-semibold text-white">Share your current setup in plain English.</p>
          <p className="mt-3">Useful details:</p>
          <ul className="mt-2 space-y-1">
            <li>• Where leads come from now</li>
            <li>• How fast your team responds</li>
            <li>• Where deals usually stall</li>
            <li>• What you want to improve in the next 90 days</li>
          </ul>
        </div>

        <p className="text-sm text-slate-300">If your current process feels manual, inconsistent, or too dependent on one person, that’s exactly what we solve.</p>
        <p className="text-sm text-slate-200">Prefer to talk it through live? <a href="/contact" className="font-semibold text-emerald-300">Book a 20-Minute Growth Blueprint</a></p>
      </section>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <ContactForm />
      </div>
    </div>
  );
}
