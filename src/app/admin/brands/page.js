"use client";

import { useEffect, useState } from "react";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadBrands() {
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadBrands();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add brand");
      setSaving(false);
      return;
    }

    setName("");
    setSaving(false);
    loadBrands();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this brand?")) return;
    await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    loadBrands();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Brands</h1>
      <p className="text-gray-500 text-sm mb-6">Manage the brands you sell</p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sigma Collection, Metro"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : brands.length === 0 ? (
        <p className="text-sm text-gray-400">No brands yet. Add your first one above.</p>
      ) : (
        <div className="space-y-2">
          {brands.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-medium">{b.name}</span>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}