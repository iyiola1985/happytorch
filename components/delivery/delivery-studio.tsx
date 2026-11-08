"use client";

import { useEffect, useState } from "react";
import { GlobeView } from "@/components/delivery/globe-view";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export function DeliveryStudio() {
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scope, setScope] = useState<"" | "nationwide" | "international">("");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      query.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Origin — Lagos, Nigeria</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-charcoal">
            The arcs are compositional. A destination is confirmed when you enquire. Nationwide Nigerian delivery and international shipping are arranged separately.
          </p>
        </div>
        <div className="h-[70vw] max-h-[640px] min-h-[320px] bg-ink lg:h-[70vh]">
          <GlobeView reduced={reduced} paused={hidden} />
        </div>
      </div>
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <button type="button" onClick={() => setScope("nationwide")} className={`border p-8 text-left ${scope === "nationwide" ? "border-red" : "border-espresso/15"}`}>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-espresso/50">Within Nigeria</p>
          <h2 className="mt-4 font-serif text-4xl">Nationwide delivery</h2>
          <p className="mt-4 text-sm leading-6">Submit the state and city with your enquiry.</p>
        </button>
        <button type="button" onClick={() => setScope("international")} className={`border p-8 text-left ${scope === "international" ? "border-red" : "border-espresso/15"}`}>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-espresso/50">Beyond Nigeria</p>
          <h2 className="mt-4 font-serif text-4xl">International shipping</h2>
          <p className="mt-4 text-sm leading-6">Submit the destination country with your enquiry.</p>
        </button>
      </div>
      <div className="mt-16 max-w-3xl">
        <EnquiryForm key={scope || "open"} intent="delivery" submitLabel="Enquire about delivery" deliveryDefault={scope} showDelivery />
      </div>
    </div>
  );
}
