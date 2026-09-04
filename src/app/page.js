"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory
      ? `/api/products?category=${activeCategory}`
      : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Sigma Collection</h1>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="p-1">🔍</button>
          <button aria-label="Cart" className="p-1">🛍️</button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-6 pb-4">
        <h2 className="text-2xl font-bold leading-snug">Step into style.</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ladies footwear, curated for every occasion.
        </p>
      </section>

      {/* Category chips */}
      <section className="px-4 pb-4 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap ${
              activeCategory === "" ? "bg-black text-white border-black" : "border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap ${
                activeCategory === cat.slug ? "bg-black text-white border-black" : "border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      {loading ? (
        <p className="px-4 text-sm text-gray-400">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="px-4 text-sm text-gray-400">No products found.</p>
      ) : (
        <section className="px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="rounded-xl overflow-hidden border border-gray-100 block"
            >
              <div className="aspect-square bg-gray-100 relative">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No Image
                  </div>
                )}
                {p.status === "INCOMING" && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Incoming
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-900 font-semibold mt-0.5">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Bottom navigation - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 sm:hidden">
        <button className="flex flex-col items-center text-xs gap-0.5">
          <span>🏠</span>Home
        </button>
        <button className="flex flex-col items-center text-xs gap-0.5">
          <span><Link href="/search" aria-label="Search" className="p-1">🔍</Link></span>Search
        </button>
        <button className="flex flex-col items-center text-xs gap-0.5">
          <span><Link href="/cart" aria-label="Cart" className="p-1">🛍️</Link></span>Cart
        </button>
        <button className="flex flex-col items-center text-xs gap-0.5">
          <span>👤</span>Account
        </button>
      </nav>
    </main>
  );
}