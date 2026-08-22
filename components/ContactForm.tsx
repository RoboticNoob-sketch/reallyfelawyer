"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/40 bg-surface p-8 text-center">
        <h3 className="text-xl font-bold text-white">Thanks — we&rsquo;ve got it.</h3>
        <p className="mt-2 text-sm text-body">
          We review every submission within hours, 24/7, and someone will call you to
          discuss your case in plain English, at no cost.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-white">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-white">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-white">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-semibold text-white"
        >
          Briefly describe what happened
        </label>
        <p className="mb-2 text-xs text-muted">
          Please do not include sensitive medical details in this form — we&rsquo;ll
          request records securely if needed.
        </p>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong sending that — please call us instead at{" "}
          <a href="tel:+18665836763" className="underline">
            +1 (866) LT FOR ME
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Get My Free Case Review"}
      </button>

      <p className="text-xs text-muted">
        Submitting this form does not create an attorney-client relationship.
      </p>
    </form>
  );
}
