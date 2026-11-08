import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = "Happy Touch Interiors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.ink,
          color: brand.ivory,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", letterSpacing: 8, fontSize: 22, color: brand.forest }}>LAGOS</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 0.9 }}>
          <div style={{ display: "flex" }}>HAPPY TOUCH</div>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 10, marginTop: 18 }}>INTERIORS</div>
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>Your No.1 Source for Home Elegance.</div>
      </div>
    ),
    size,
  );
}
