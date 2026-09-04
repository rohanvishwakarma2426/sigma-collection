"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-lg">Back</Link>
        <h1 className="text-sm font-medium">My Cart</h1>
      </header>

      {items.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-400 mb-4">Your cart is empty.</p>
          <Link href="/" className="text-sm text-black underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
            >
              <Link href={`/products/${item.slug}`} className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" />
                ) : null}
              </Link>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm text-gray-900 font-semibold">Rs. {item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 border border-gray-200 rounded-lg text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 border border-gray-200 rounded-lg text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-xs text-red-600 hover:underline flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-lg font-bold">Rs. {totalPrice}</span>
          </div>
          <Link
            href="/cart/checkout"
            className="block w-full bg-black text-white text-center rounded-lg py-3 text-sm font-medium"
          >
            Proceed to Enquiry
          </Link>
        </div>
      ) : null}
    </main>
  );
}