import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { adminConfigError, readSession } from "@/lib/auth";

export const metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center bg-ivory px-6 text-espresso">
      <div className="w-full max-w-md">
        <p className="font-serif text-3xl tracking-[0.14em]">HAPPY TOUCH</p>
        <h1 className="mt-4 font-serif text-5xl">Studio desk</h1>
        <LoginForm configured={!adminConfigError()} />
      </div>
    </div>
  );
}
