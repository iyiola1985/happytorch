export function whatsappHref(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsAppMessage() {
  return "Hello Happy Touch Interiors, I would like to make an enquiry.";
}

export function wholesaleWhatsAppMessage() {
  return "Hello Happy Touch Interiors, I would like to discuss a wholesale order.";
}

export function interiorWhatsAppMessage() {
  return "Hello Happy Touch Interiors, I would like to discuss an interior project.";
}

export function productWhatsAppMessage(input: { name: string; category: string }) {
  return `Hello Happy Touch Interiors, I would like to enquire about ${input.name} (${input.category}). Please share the details, availability and delivery to my destination.`;
}
