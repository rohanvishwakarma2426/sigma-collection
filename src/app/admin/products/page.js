"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-700",
  INCOMING: "bg-blue-100 text-blue-700",
  OUT_OF_STOCK: "bg-orange-100 text-orange-700",
  HIDDEN: "bg-gray-100 text-gray-500",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function handleStatusChange(id, status) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400">No products yet. Add your first one.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
            >
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{p.price} · SKU: {p.sku}
                </p>
              </div>

              <select
                value={p.status}
                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                className={`text-xs rounded-full px-2 py-1 border-0 ${statusColors[p.status]}`}
              >
                <option value="AVAILABLE">Available</option>
                <option value="INCOMING">Incoming</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            <div className="flex items-center gap-2 flex-shrink-0">
                <a href={`/admin/products/${p.id}/edit`}
                className="text-xs text-blue-600 hover:undeline">
                    Sizes/Colors
                </a>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-600 hover:underline flex-shrink-0"
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}