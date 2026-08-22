"use client";

import { useState } from "react";
import { Plus, MessageCircleReply } from "lucide-react";

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, j) => {
        const isOpen = openIndex === j;
        return (
          <div
            key={j}
            className={`rounded-2xl border p-5 transition-colors duration-300 ${
              isOpen ? "border-gold/60 bg-surface" : "border-hairline bg-surface hover:border-gold/30"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : j)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 text-left font-semibold text-white"
            >
              {item.q}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-300 ${
                  isOpen ? "rotate-45 border-gold bg-gold/10" : ""
                }`}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mt-4 flex gap-3 border-t border-hairline pt-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold">
                    <MessageCircleReply className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm text-body">{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
