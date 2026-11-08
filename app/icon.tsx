import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.ink,
          color: brand.ivory,
          fontSize: 13,
          letterSpacing: 1,
        }}
      >
        HT
      </div>
    ),
    size,
  );
}
