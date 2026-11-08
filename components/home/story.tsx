import Link from "next/link";
import { CollectionCaption } from "@/components/home/collection-caption";
import { Reveal } from "@/components/ui/reveal";
import { enquiryCopy, type PublicProduct } from "@/lib/public-catalogue";
import { site } from "@/lib/site";

function findPiece(products: PublicProduct[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function Story({ featured, products }: { featured: PublicProduct[]; products: PublicProduct[] }) {
  const hero = findPiece(products, "oval-dining-set");
  const chaise = findPiece(products, "display-cabinet");
  const recliner = findPiece(products, "recliner-sofa");
  const bed = findPiece(products, "upholstered-bed");
  const pair = [chaise, recliner].filter((product): product is PublicProduct => Boolean(product));

  return (
    <div id="story" className="story relative z-10">
      <p className="sr-only">
        A bouclé sofa in a light studio, then a chaise and a recliner, an upholstered bed, and a living room, as the page is scrolled.
      </p>
      <section id="arrival" data-scene="arrival" className="scene relative z-20 h-[100svh] overflow-hidden bg-ivory">
        {hero?.images[0] ? (
          <Link href={`/collection/${hero.slug}`} aria-label={hero.name} className="absolute inset-x-0 bottom-16 top-24 mx-auto block max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.images[0].src}
              alt={hero.images[0].alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full translate-y-16 object-contain object-bottom"
            />
          </Link>
        ) : null}
        <div className="relative z-10 mx-auto max-w-3xl bg-gradient-to-b from-ivory from-55% via-ivory/85 to-transparent px-6 pt-28 pb-6 text-center">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.34em] text-forest">{site.name}</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,4.2rem)] leading-[0.88] font-medium">
            YOUR HOME.
            <br />
            YOUR STATEMENT.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-espresso/80 md:text-base md:leading-7">
            Discover furniture and interiors that transform ordinary spaces into extraordinary living experiences.
          </p>
          <div className="pointer-events-auto mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="/collection" className="btn">
              Explore the collection
            </Link>
            <Link href="/about" className="rule-link text-espresso/80">
              <span>Discover Happy Touch</span>
              <span className="line" />
            </Link>
          </div>
        </div>
      </section>

      <section id="reveal" data-scene="reveal" className="scene relative z-20 bg-ivory px-6 py-24 md:px-16 md:py-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="kicker justify-center text-[0.68rem] uppercase tracking-[0.34em] text-forest">02 — The reveal</p>
          <h2 className="mt-6 font-serif text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.92]">
            Elegance is not added to a home.
            <br />
            It is built into every detail.
          </h2>
        </Reveal>
        {pair.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-5xl items-end gap-x-8 gap-y-14 md:grid-cols-2">
            {pair.map((product) => (
              <Link key={product.slug} href={`/collection/${product.slug}`} className="group block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]?.src}
                  alt={product.images[0]?.alt ?? product.name}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto max-h-[52vh] w-full object-contain object-bottom"
                />
                <p className="mt-5 text-center font-serif text-3xl">{product.name}</p>
              </Link>
            ))}
          </div>
        ) : null}
        {bed?.images[0] ? (
          <div className="mx-auto mt-28 grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
            <Reveal>
              <p className="kicker text-[0.68rem] uppercase tracking-[0.34em] text-forest">{bed.colour}</p>
              <h2 className="mt-5 font-serif text-[clamp(2.4rem,4vw,4.2rem)] leading-[0.92]">{bed.name}</h2>
              {bed.description ? <p className="mt-6 max-w-md text-base leading-7 text-espresso/80">{bed.description}</p> : null}
              <p className="mt-4 text-sm">{enquiryCopy.details}</p>
              <div className="pointer-events-auto mt-8 flex flex-col items-start gap-5">
                <Link href={`/collection/${bed.slug}#enquire`} className="btn">
                  {enquiryCopy.request}
                </Link>
                <Link href={`/collection/${bed.slug}`} className="rule-link text-espresso">
                  <span>View the piece</span>
                  <span className="line" />
                </Link>
              </div>
            </Reveal>
            <Link href={`/collection/${bed.slug}`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bed.images[0].src}
                alt={bed.images[0].alt}
                loading="lazy"
                decoding="async"
                className="mx-auto max-h-[48vh] w-full object-contain"
              />
            </Link>
          </div>
        ) : null}
      </section>

      <section id="living" data-scene="living" className="scene flex min-h-[140svh] items-end px-6 pb-28 md:px-10 md:pb-36">
        <Reveal className="max-w-lg">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.34em] text-forest">03 — The living room</p>
          <h2 className="mt-6 font-serif text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.9]">A room, composed.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-espresso/80">
            Seating, a centre table, light, and the quiet space between them. The camera moves into the room as you scroll.
          </p>
        </Reveal>
      </section>

      <section id="collection" data-scene="collection" className="scene flex min-h-[140svh] items-start px-6 pt-36 md:px-10">
        <Reveal className="max-w-xl">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.34em] text-forest">04 — The collection</p>
          <h2 className="mt-6 font-serif text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.9]">Pieces, held in light.</h2>
          <CollectionCaption featured={featured} />
        </Reveal>
      </section>

      <section id="brand" data-scene="brand" className="scene flex min-h-[110svh] items-center px-6 md:px-10">
        <Reveal className="max-w-3xl">
          <p className="kicker text-[0.68rem] uppercase tracking-[0.34em] text-forest">{site.name} · Lagos</p>
          <h2 className="mt-6 font-serif text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.92]">{site.tagline}</h2>
          <p className="mt-8 max-w-xl text-base leading-7 text-espresso/80">
            Interior and construction. Furniture for the home, offered wholesale and retail, with delivery across Nigeria and onward to the world.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/interiors" className="rule-link text-espresso">
              <span>Interiors</span>
              <span className="line" />
            </Link>
            <Link href="/wholesale" className="rule-link text-espresso">
              <span>Wholesale</span>
              <span className="line" />
            </Link>
            <Link href="/delivery" className="rule-link text-espresso">
              <span>Delivery</span>
              <span className="line" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="invitation" data-scene="invitation" className="scene flex min-h-[100svh] items-end px-6 pb-28 md:px-10 md:pb-24">
        <Reveal className="max-w-4xl">
          <h2 className="font-serif text-[clamp(3rem,7vw,6.8rem)] leading-[0.88]">
            LET&apos;S MAKE YOUR
            <br />
            SPACE UNFORGETTABLE.
          </h2>
          <div className="pointer-events-auto mt-10 flex flex-col items-start gap-5">
            <Link href="/collection" className="rule-link text-espresso">
              <span>Explore our collection</span>
              <span className="line" />
            </Link>
            <Link href="/showroom" className="btn">
              Enter the 3D showroom
            </Link>
            <Link href="/contact" className="rule-link text-espresso">
              <span>Talk to our team</span>
              <span className="line" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
