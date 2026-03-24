import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";

export const metadata = {
  title: "Contact Velocity Builders",
  description:
    "Contact Velocity Builders for a free growth blueprint — we'll identify your biggest pipeline leaks, fix lead response times & automate your follow-up.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 py-16">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
          alt="Contact us"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Contact</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Tell Us What&apos;s Breaking in Your Pipeline.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            We reply in 1 business day with a clear plan: what to fix first, what to automate, and what to ignore.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="font-semibold text-gray-900">Share your current setup in plain English.</p>
              <p className="mt-3 text-sm text-gray-600">Useful details:</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Where leads come from now
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  How fast your team responds
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Where deals usually stall
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  What you want to improve in the next 90 days
                </li>
              </ul>
            </div>

            <p className="text-gray-600">If your current process feels manual, inconsistent, or too dependent on one person, that&apos;s exactly what we solve.</p>

            {/* Direct contact info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Or reach us directly:</h3>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <a href="mailto:hello@velocity-builders.com" className="text-blue-600 font-medium hover:text-blue-800 transition">hello@velocity-builders.com</a>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <a href="tel:+17038591467" className="text-blue-600 font-medium hover:text-blue-800 transition">(703) 859-1467</a>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Get Your Growth Blueprint</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
