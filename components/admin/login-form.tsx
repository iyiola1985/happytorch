"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/actions";

const initial: FormState = { ok: false };

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="mt-10 grid gap-6">
      {!configured ? (
        <p className="text-sm leading-6">
          The desk is not configured. Set AUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD in the server environment. They are never written into the website.
        </p>
      ) : null}
      <label className="block text-[0.68rem] uppercase tracking-[0.22em]">
        Email
        <input className="field" name="email" type="email" autoComplete="username" required />
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.22em]">
        Password
        <input className="field" name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error ? <p className="text-sm text-red">{state.error}</p> : null}
      <button type="submit" disabled={pending || !configured} className="btn justify-self-start">
        {pending ? "Signing in" : "Enter"}
      </button>
    </form>
  );
}
