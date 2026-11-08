import "server-only";

const imageTypes: Record<string, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

export function detectImage(bytes: Buffer) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes.toString("ascii", 1, 4) === "PNG") return "png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (bytes.toString("ascii", 4, 8) === "ftyp") {
    const brand = bytes.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
  }
  return null;
}

export function detectModel(bytes: Buffer) {
  if (bytes.length < 4) return null;
  if (bytes.toString("ascii", 0, 4) === "glTF") return "glb";
  const head = bytes.subarray(0, 80).toString("utf8").trim();
  if (head.startsWith("{")) return "gltf";
  return null;
}

export function imageExtension(kind: string | null) {
  if (!kind) return null;
  return imageTypes[kind] ?? kind;
}
