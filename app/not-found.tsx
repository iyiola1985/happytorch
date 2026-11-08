import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory px-6 text-espresso">
      <div className="text-center">
        <p className="font-serif text-2xl tracking-[0.16em]">HAPPY TOUCH</p>
        <h1 className="mt-6 font-serif text-5xl">This page is not in the house.</h1>
        <Link href="/" className="btn mt-8">
          Return home
        </Link>
      </div>
    </div>
  );
}
