import { assertNever } from "@/lib/assert";
import { brand } from "@/lib/brand";
import type { ShowroomRoomId } from "@/lib/types";

export type AnchorKind =
  | "sofa"
  | "chair"
  | "table"
  | "lamp"
  | "diningTable"
  | "diningChair"
  | "bed"
  | "pendant"
  | "sideTable"
  | "console";

export type Anchor = {
  id: string;
  room: ShowroomRoomId;
  kind: AnchorKind;
  label: string;
  categorySlug: string;
  position: [number, number, number];
  rotationY: number;
  radius: number;
  height: number;
};

export type RoomPose = {
  id: ShowroomRoomId;
  name: string;
  summary: string;
  camera: [number, number, number];
  target: [number, number, number];
  background: string;
  key: string;
  keyIntensity: number;
  fill: number;
};

export const rooms: RoomPose[] = [
  {
    id: "living",
    name: "The Living Room",
    summary: "A low, warm room for seating, a centre table and light.",
    camera: [3.1, 1.35, 4.15],
    target: [0, 0.5, 0.1],
    background: brand.ink,
    key: brand.ivory,
    keyIntensity: 28,
    fill: 0.38,
  },
  {
    id: "dining",
    name: "The Dining Room",
    summary: "A longer table, chairs drawn in, and a single pendant.",
    camera: [3.4, 1.7, 4.3],
    target: [0, 0.55, 0],
    background: brand.ink,
    key: brand.ivory,
    keyIntensity: 26,
    fill: 0.42,
  },
  {
    id: "bedroom",
    name: "The Bedroom",
    summary: "A quieter room. Bed, side tables, and a shaded lamp.",
    camera: [3.3, 1.45, 4.4],
    target: [0, 0.55, -0.1],
    background: brand.ink,
    key: brand.ivory,
    keyIntensity: 18,
    fill: 0.28,
  },
  {
    id: "lounge",
    name: "The Lounge",
    summary: "Lower seating, closer light, a smaller table.",
    camera: [2.7, 1.2, 3.6],
    target: [0, 0.42, 0],
    background: brand.ink,
    key: brand.ivory,
    keyIntensity: 16,
    fill: 0.18,
  },
  {
    id: "luxury",
    name: "The Luxury Home Collection",
    summary: "Pieces isolated on plinths, the way a collection is studied.",
    camera: [0.2, 1.35, 6.2],
    target: [0, 0.5, 0],
    background: brand.ink,
    key: brand.ivory,
    keyIntensity: 32,
    fill: 0.22,
  },
];

export const anchors: Anchor[] = [
  { id: "living-sofa", room: "living", kind: "sofa", label: "Sofa", categorySlug: "luxury-sofas-sectionals", position: [0.15, 0, -0.55], rotationY: 0, radius: 1.35, height: 0.78 },
  { id: "living-chair", room: "living", kind: "chair", label: "Accent chair", categorySlug: "accent-chairs", position: [-1.75, 0, 0.55], rotationY: 0.7, radius: 0.62, height: 0.86 },
  { id: "living-table", room: "living", kind: "table", label: "Centre table", categorySlug: "centre-tables", position: [0.05, 0, 0.85], rotationY: 0.2, radius: 0.75, height: 0.42 },
  { id: "living-lamp", room: "living", kind: "lamp", label: "Floor lamp", categorySlug: "lighting", position: [1.65, 0, -0.15], rotationY: 0, radius: 0.4, height: 1.45 },
  { id: "dining-table", room: "dining", kind: "diningTable", label: "Dining table", categorySlug: "dining-sets", position: [0, 0, 0], rotationY: 0, radius: 1.15, height: 0.76 },
  { id: "dining-chair-a", room: "dining", kind: "diningChair", label: "Dining chair", categorySlug: "dining-sets", position: [0, 0, 1.05], rotationY: Math.PI, radius: 0.42, height: 0.92 },
  { id: "dining-chair-b", room: "dining", kind: "diningChair", label: "Dining chair", categorySlug: "dining-sets", position: [0, 0, -1.05], rotationY: 0, radius: 0.42, height: 0.92 },
  { id: "dining-chair-c", room: "dining", kind: "diningChair", label: "Dining chair", categorySlug: "dining-sets", position: [-1.15, 0, 0], rotationY: Math.PI / 2, radius: 0.42, height: 0.92 },
  { id: "dining-chair-d", room: "dining", kind: "diningChair", label: "Dining chair", categorySlug: "dining-sets", position: [1.15, 0, 0], rotationY: -Math.PI / 2, radius: 0.42, height: 0.92 },
  { id: "dining-pendant", room: "dining", kind: "pendant", label: "Pendant", categorySlug: "lighting", position: [0, 0, 0], rotationY: 0, radius: 0.45, height: 0.7 },
  { id: "bedroom-bed", room: "bedroom", kind: "bed", label: "Bed", categorySlug: "bedroom-furniture", position: [0, 0, -0.2], rotationY: 0, radius: 1.35, height: 1.05 },
  { id: "bedroom-side-a", room: "bedroom", kind: "sideTable", label: "Side table", categorySlug: "bedroom-furniture", position: [-1.45, 0, 0.85], rotationY: 0, radius: 0.4, height: 0.52 },
  { id: "bedroom-side-b", room: "bedroom", kind: "sideTable", label: "Side table", categorySlug: "bedroom-furniture", position: [1.45, 0, 0.85], rotationY: 0, radius: 0.4, height: 0.52 },
  { id: "bedroom-lamp", room: "bedroom", kind: "lamp", label: "Lamp", categorySlug: "lighting", position: [1.45, 0, 0.85], rotationY: 0, radius: 0.36, height: 1.15 },
  { id: "lounge-sofa", room: "lounge", kind: "sofa", label: "Lounge seating", categorySlug: "lounge-furniture", position: [0, 0, -0.35], rotationY: 0.15, radius: 1.2, height: 0.7 },
  { id: "lounge-chair", room: "lounge", kind: "chair", label: "Lounge chair", categorySlug: "lounge-furniture", position: [-1.45, 0, 0.65], rotationY: 0.9, radius: 0.6, height: 0.8 },
  { id: "lounge-table", room: "lounge", kind: "table", label: "Low table", categorySlug: "centre-tables", position: [0.15, 0, 0.75], rotationY: 0, radius: 0.6, height: 0.36 },
  { id: "luxury-chair", room: "luxury", kind: "chair", label: "Accent chair", categorySlug: "accent-chairs", position: [-2.4, 0, 0], rotationY: 0.4, radius: 0.7, height: 0.86 },
  { id: "luxury-console", room: "luxury", kind: "console", label: "Console", categorySlug: "tv-consoles-media-units", position: [-0.8, 0, 0], rotationY: 0, radius: 0.9, height: 0.52 },
  { id: "luxury-table", room: "luxury", kind: "table", label: "Centre table", categorySlug: "centre-tables", position: [0.9, 0, 0], rotationY: 0.3, radius: 0.75, height: 0.42 },
  { id: "luxury-lamp", room: "luxury", kind: "lamp", label: "Lamp", categorySlug: "lighting", position: [2.4, 0, 0], rotationY: 0, radius: 0.45, height: 1.45 },
];

export function roomById(id: ShowroomRoomId) {
  const room = rooms.find((item) => item.id === id);
  if (!room) throw new Error(`Unknown room ${id}`);
  return room;
}

export function anchorsFor(room: ShowroomRoomId) {
  return anchors.filter((anchor) => anchor.room === room);
}

export function roomName(id: ShowroomRoomId) {
  switch (id) {
    case "living":
      return "The Living Room";
    case "dining":
      return "The Dining Room";
    case "bedroom":
      return "The Bedroom";
    case "lounge":
      return "The Lounge";
    case "luxury":
      return "The Luxury Home Collection";
    default:
      return assertNever(id);
  }
}
