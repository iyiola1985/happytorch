export function SofaHero() {
  return (
    <section className="relative h-[100dvh] overflow-hidden bg-[#E9DBCE]">
      <img
        src="/hero/mustard-velvet-room.webp"
        alt="Mustard velvet sofa"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center px-5 pt-[max(6.5rem,calc(env(safe-area-inset-top)+5.5rem))] text-center text-[#111111] min-[1024px]:px-6">
        <div>
          <p className="font-sans text-[clamp(2rem,8vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">Furniture</p>
          <p className="font-sans text-[clamp(2rem,8vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">&amp; Interiors</p>
        </div>
      </div>
    </section>
  );
}
