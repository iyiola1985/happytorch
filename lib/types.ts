export const stockStatuses = ["in_stock", "out_of_stock", "made_to_order"] as const;
export type StockStatus = (typeof stockStatuses)[number];

export const showroomRoomIds = ["living", "dining", "bedroom", "lounge", "luxury"] as const;
export type ShowroomRoomId = (typeof showroomRoomIds)[number];

export const enquiryTypes = ["retail", "wholesale", "interior", "delivery", "general"] as const;
export type EnquiryType = (typeof enquiryTypes)[number];

export const enquiryStatuses = ["new", "read", "archived"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const deliveryScopes = ["nationwide", "international"] as const;
export type DeliveryScope = (typeof deliveryScopes)[number];

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  images: ProductImage[];
  priceNgn: number | null;
  internationalPrice: { amount: number; currency: string } | null;
  stockStatus: StockStatus | null;
  dimensions: string;
  material: string;
  colour: string;
  featured: boolean;
  homepageFeatured: boolean;
  showroomRoom: ShowroomRoomId | null;
  showroomAnchor: string | null;
  modelPath: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type Settings = {
  whatsappNumber: string;
  instagramUrl: string;
  chairModelPath: string;
  chairScale: number;
  chairRotationY: number;
  heroProductId: string;
  logoPath: string;
};

export type Enquiry = {
  id: string;
  type: EnquiryType;
  status: EnquiryStatus;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  businessName: string;
  role: string;
  destination: string;
  deliveryScope: DeliveryScope | null;
  interests: string[];
  quantity: string;
  productId: string;
  productName: string;
  projectType: string;
};
