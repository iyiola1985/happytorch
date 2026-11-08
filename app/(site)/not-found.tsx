import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70svh] place-items-center px-6 text-center">
      <div>
        <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Happy Touch Interiors</p>
        <h1 className="mt-4 font-serif text-6xl">This page is not in the house.</h1>
        <Link href="/" className="rule-link mt-8">
          <span>Return home</span>
          <span className="line" />
        </Link>
      </div>
    </div>
  );
}
