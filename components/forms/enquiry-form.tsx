"use client";

import { useActionState } from "react";
import { createEnquiry, type FormState } from "@/lib/actions";
import type { Category, EnquiryType } from "@/lib/types";
import { Field } from "@/components/ui/field";

const initial: FormState = { ok: false };

export function EnquiryForm({
  intent,
  productSlug,
  productName,
  categories = [],
  submitLabel,
  showDelivery = false,
  deliveryDefault = "",
}: {
  intent: EnquiryType;
  productSlug?: string;
  productName?: string;
  categories?: Category[];
  submitLabel: string;
  showDelivery?: boolean;
  deliveryDefault?: "" | "nationwide" | "international";
}) {
  const [state, action, pending] = useActionState(createEnquiry, initial);
  if (state.ok) {
    return (
      <p role="status" className="font-serif text-4xl leading-tight">
        Your enquiry has been received.
      </p>
    );
  }
  const error = (name: string) => state.fieldErrors?.[name]?.[0];
  return (
    <form action={action} className="grid gap-8">
      <input type="hidden" name="intent" value={intent} />
      {productSlug ? <input type="hidden" name="productSlug" value={productSlug} /> : null}
      {productName ? <p className="text-sm text-espresso/70">Enquiring about {productName}</p> : null}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Name" error={error("name")}>
          <input className="field" name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" error={error("email")}>
          <input className="field" name="email" type="email" autoComplete="email" required />
        </Field>
      </div>
      <Field label="Telephone" error={error("phone")}>
        <input className="field" name="phone" autoComplete="tel" />
      </Field>
      {intent === "wholesale" ? (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Business" error={error("businessName")}>
              <input className="field" name="businessName" required />
            </Field>
            <Field label="Role" error={error("role")}>
              <input className="field" name="role" />
            </Field>
          </div>
          <Field label="Estimated quantity" error={error("quantity")}>
            <input className="field" name="quantity" required />
          </Field>
          <fieldset>
            <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.22em] text-espresso/60">Product interests</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" name="interests" value={category.name} />
                  {category.name}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      ) : null}
      {intent === "interior" ? (
        <Field label="Project" error={error("projectType")}>
          <select className="field" name="projectType" defaultValue="Residential">
            <option>Residential</option>
            <option>Commercial</option>
            <option>Not yet defined</option>
          </select>
        </Field>
      ) : null}
      {showDelivery || intent === "delivery" || intent === "wholesale" || intent === "retail" ? (
        <>
          <Field label={intent === "wholesale" ? "Destination country" : "Destination"} error={error("destination")}>
            <input className="field" name="destination" required={intent === "delivery" || intent === "wholesale"} />
          </Field>
          <Field label="Delivery" error={error("deliveryScope")}>
            <select className="field" name="deliveryScope" defaultValue={deliveryDefault || (intent === "delivery" ? "" : "nationwide")} required={intent === "delivery"}>
              <option value="">Choose</option>
              <option value="nationwide">Nationwide, Nigeria</option>
              <option value="international">International</option>
            </select>
          </Field>
        </>
      ) : null}
      <Field label="Message" error={error("message")}>
        <textarea className="field min-h-36 resize-y" name="message" required />
      </Field>
      {state.error ? <p className="text-sm text-red">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="btn justify-self-start">
        {pending ? "Sending" : submitLabel}
      </button>
    </form>
  );
}
