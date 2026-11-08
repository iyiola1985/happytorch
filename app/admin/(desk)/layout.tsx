import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

const links = [
  ["Overview", "/admin"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Enquiries", "/admin/enquiries"],
  ["Settings", "/admin/settings"],
] as const;

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-ivory text-espresso md:grid md:grid-cols-[16rem_1fr]">
      <aside className="border-b border-ivory/15 bg-ink px-6 py-8 text-ivory md:min-h-screen md:border-b-0 md:border-r">
        <p className="kicker font-serif text-2xl tracking-[0.12em]">Studio desk</p>
        <p className="mt-2 text-xs text-ivory/60">{session.email}</p>
        <nav className="mt-8 flex flex-wrap gap-4 md:flex-col">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[0.68rem] uppercase tracking-[0.2em]">
              {label}
            </Link>
          ))}
          <Link href="/" className="text-[0.68rem] uppercase tracking-[0.2em]">
            View site
          </Link>
        </nav>
        <form action={logoutAction} className="mt-8">
          <button type="submit" className="text-[0.68rem] uppercase tracking-[0.2em]">
            Sign out
          </button>
        </form>
      </aside>
      <div className="px-6 py-10 md:px-10">{children}</div>
    </div>
  );
}
