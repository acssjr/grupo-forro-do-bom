export function buildWhatsAppUrl(number: string, message: string): string {
  const normalizedNumber = number.replace(/\D/g, "");

  if (!normalizedNumber) {
    return "#whatsapp-pendente";
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
