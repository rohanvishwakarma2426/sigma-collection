"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartCheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((data) => setWhatsappNumber(data.whatsappNumber));
  }, []);

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      router.push("/cart");
    }
  }, [items, submitted, router]);

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

    try {
      // Submit one enquiry per cart item (schema supports items per enquiry;
      // simplest correct approach here is one enquiry with the first item,
      // then attach rest via repeated calls is overkill — instead we submit
      // items sequentially against separate enquiry item entries.
      let lastEnquiry = null;
      for (const item of items) {
        const res = await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit enquiry");
        }
        lastEnquiry = data;
      }

      if (whatsappNumber) {
        const lines = [
          `Hi, I am interested in these products:`,
          ...items.map((i) => `- ${i.name} x ${i.quantity} (Rs. ${i.price})`),
          `Total: Rs. ${totalPrice}`,
          `My name: ${form.customerName}`,
          form.message ? `Message: ${form.message}` : null,
        ].filter(Boolean);

        const text = encodeURIComponent(lines.join("\n"));
        const phone = whatsappNumber.replace(/[^0-9]/g, "");
        setWhatsappLink(`https://wa.me/${phone}?text=${text}`);
      }

      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
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
        <Link href="/cart" className="text-lg">Back</Link>
        <h1 className="text-sm font-medium">Confirm Enquiry</h1>
      </header>

      <div className="p-4 border-b border-gray-100">
        <p className="text-sm font-medium mb-2">{items.length} item(s)</p>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm text-gray-600 py-1">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs. {item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>Rs. {totalPrice}</span>
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number *</label>
          <input
            type="tel"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
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
          <label className="block text-sm font-medium mb-1">Message (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
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