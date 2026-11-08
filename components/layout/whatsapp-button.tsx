"use client";

import { generalWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

export function WhatsAppButton({ number }: { number: string }) {
  const href = whatsappHref(number, generalWhatsAppMessage());
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-3 bg-espresso px-4 text-[0.68rem] uppercase tracking-[0.22em] text-ivory"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full border border-forest text-[0.65rem]">Wa</span>
      WhatsApp
    </a>
  );
}
