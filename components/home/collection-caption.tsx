"use client";

import Link from "next/link";
import { useJourneyMarker } from "@/components/home/home-stage";
import { enquiryCopy, publicCopy, type PublicProduct } from "@/lib/public-catalogue";

const disciplines = ["Seating", "Tables", "Light", "Storage"];

export function CollectionCaption({ featured }: { featured: PublicProduct[] }) {
  const { slot } = useJourneyMarker();
  const piece = featured[slot];
  if (piece) {
    return (
      <div className="mt-8">
        <p className="font-serif text-4xl leading-none md:text-6xl">{piece.name}</p>
        {publicCopy(piece.description) ? <p className="mt-4 max-w-md text-sm leading-6 text-espresso/70">{publicCopy(piece.description)}</p> : null}
        <p className="mt-4 text-sm">{enquiryCopy.details}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <Link href={`/collection/${piece.slug}#enquire`} className="btn">
            {enquiryCopy.request}
          </Link>
          <Link href={`/collection/${piece.slug}`} className="rule-link text-espresso">
            <span>View the piece</span>
            <span className="line" />
          </Link>
        </div>
      </div>
    );
  }
  return <p className="mt-8 font-serif text-5xl leading-none md:text-7xl">{disciplines[slot] ?? disciplines[0]}</p>;
}
