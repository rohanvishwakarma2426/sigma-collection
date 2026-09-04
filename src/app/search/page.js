"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
          setSearched(true);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-lg">
          Back
        </button>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shoes, brands..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </header>

      <div className="p-4">
        {loading ? (
          <p className="text-sm text-gray-400">Searching...</p>
        ) : !searched ? (
          <p className="text-sm text-gray-400">Start typing to search products.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-400">No products found for "{query}".</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="rounded-xl overflow-hidden border border-gray-100 block"
              >
                <div className="aspect-square bg-gray-100">
                  {p.images && p.images[0] ? (
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
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-sm text-gray-900 font-semibold mt-0.5">
                    Rs. {p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}