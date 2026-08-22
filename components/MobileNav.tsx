"use client";

import { useState } from "react";
import Link from "next/link";
import { primaryNav } from "@/lib/content";

export default function MobileNav({ phoneTelLink, phone }: { phoneTelLink: string; phone: string }) {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-65px)] overflow-y-auto border-b border-hairline bg-canvas px-6 py-6"
        >
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg px-3 py-3 text-base font-semibold text-white hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-expanded={openSection === item.href}
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() =>
                        setOpenSection((s) => (s === item.href ? null : item.href))
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-muted"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className={`h-3.5 w-3.5 transition-transform ${
                          openSection === item.href ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
                {item.children && openSection === item.href && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-hairline pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-body hover:bg-surface hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <a
            href={phoneTelLink}
            className="mt-4 block rounded-full bg-gold-gradient px-5 py-3 text-center text-sm font-bold text-canvas"
          >
            {phone}
          </a>
        </div>
      )}
    </div>
  );
}
