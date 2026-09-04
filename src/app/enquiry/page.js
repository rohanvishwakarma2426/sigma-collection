"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function EnquiryPage() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    message: "",
    quantity: 1,
  });

  useEffect(() => {
    if (!productSlug) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/products/${productSlug}`).then((r) => r.json()),
      fetch("/api/settings/public").then((r) => r.json()),
    ]).then(([productData, settingsData]) => {
      setProduct(productData);
      setWhatsappNumber(settingsData.whatsappNumber);
      setLoading(false);
    });
  }, [productSlug]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.customerPhone) {
      setError("Name and phone number are required.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        productId: product.id,
        quantity: Number(form.quantity),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to submit enquiry");
      setSubmitting(false);
      return;
    }

    if (whatsappNumber) {
      const link = buildWhatsAppLink({
        businessPhone: whatsappNumber,
        customerName: form.customerName,
        productName: product.name,
        sku: product.sku,
        quantity: form.quantity,
        message: form.message,
      });
      setWhatsappLink(link);
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return <p className="p-4 text-sm text-gray-400">Loading...</p>;
  }

  if (!productSlug || !product || product.error) {
    return <p className="p-4 text-sm text-gray-400">No product selected.</p>;
  }

    if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">Done</div>
          <h1 className="text-xl font-bold mb-2">Enquiry Submitted!</h1>
          <p className="text-sm text-gray-500 mb-6">
            We have received your enquiry. Tap below to continue on WhatsApp.
          </p>

          {whatsappLink ? (
            <button
              onClick={() => window.open(whatsappLink, "_blank")}
              className="block w-full bg-green-600 text-white text-center rounded-lg py-3 text-sm font-medium mb-3"
            >
              Continue on WhatsApp
            </button>
          ) : null}

          <Link href="/" className="text-sm text-gray-500 underline">
            Back to shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href={`/products/${productSlug}`} className="text-lg">Back</Link>
        <h1 className="text-sm font-medium">Enquiry</h1>
      </header>

      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {product.images && product.images[0] ? (
            <img src={product.images[0].url} className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-gray-500">Rs. {product.price}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium mb-1">Your Name *</label>
          <input
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number *</label>
          <input
            type="tel"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="10-digit mobile number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email (optional)</label>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => updateField("customerEmail", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="Any specific size, color, or question?"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </main>
  );
}