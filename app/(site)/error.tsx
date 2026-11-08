"use client";

export default function SiteError({ error, reset }: { error: Error; reset: () => void }) {
  void error;
  return (
    <div className="grid min-h-[70svh] place-items-center px-6 text-center">
      <div>
        <h1 className="font-serif text-5xl">Something interrupted this page.</h1>
        <button type="button" onClick={reset} className="btn mt-8">
          Try again
        </button>
      </div>
    </div>
  );
}
