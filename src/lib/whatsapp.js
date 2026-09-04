export function buildWhatsAppLink({ businessPhone, customerName, productName, sku, quantity, message }) {
  const lines = [
    `Hi, I am interested in this product:`,
    `Product: ${productName}`,
    sku ? `SKU: ${sku}` : null,
    quantity ? `Quantity: ${quantity}` : null,
    `My name: ${customerName}`,
    message ? `Message: ${message}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const phone = businessPhone.replace(/[^0-9]/g, ""); // digits only

  return `https://wa.me/${phone}?text=${text}`;
}