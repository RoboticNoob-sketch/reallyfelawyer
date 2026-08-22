import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what happened. Case reviews are free, confidential, and available 24/7 — hablamos español. No fee unless we win.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Free case review</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Contact the RealLyfe Lawyer
          </h1>
          <p className="mt-4 max-w-md text-body">
            Tell us what happened. Case reviews are free, confidential, and available
            24/7 — hablamos español.
          </p>

          <ul className="mt-6 space-y-2 text-body">
            <li>
              <a href={siteConfig.phone_tel_link} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="text-muted">{siteConfig.address}</li>
          </ul>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-white">What happens next</h2>
            <ol className="mt-3 space-y-2">
              {[
                "We review your submission — usually within hours, 24/7.",
                "We call to discuss your case in plain English, at no cost.",
                "If we can help, we explain next steps — with no fee unless we win.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-body">
                  <span className="font-bold text-primary">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-10 text-xs text-muted">
            Serving Texas, Oklahoma, New Mexico, and Arizona — and nationwide through
            co-counsel. Time limits apply, so don&rsquo;t wait.
          </p>
        </div>

        <div className="rounded-2xl border border-hairline bg-surface p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
