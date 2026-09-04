"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [stock, setStock] = useState("");
  const [addingVariant, setAddingVariant] = useState(false);
  const [variantError, setVariantError] = useState("");

  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newColorName, setNewColorName] = useState("");

  function loadAll() {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/sizes").then((r) => r.json()),
      fetch("/api/admin/colors").then((r) => r.json()),
    ]).then(([productData, sizesData, colorsData]) => {
      setProduct(productData);
      setSizes(sizesData);
      setColors(colorsData);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  async function handleAddSize() {
    if (!newSizeLabel.trim()) return;
    await fetch("/api/admin/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newSizeLabel }),
    });
    setNewSizeLabel("");
    loadAll();
  }

  async function handleAddColor() {
    if (!newColorName.trim()) return;
    await fetch("/api/admin/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newColorName }),
    });
    setNewColorName("");
    loadAll();
  }

  async function handleAddVariant(e) {
    e.preventDefault();
    setVariantError("");

    if (!selectedSize && !selectedColor) {
      setVariantError("Select a size or color.");
      return;
    }

    setAddingVariant(true);

    const res = await fetch(`/api/admin/products/${id}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sizeId: selectedSize || null,
        colorId: selectedColor || null,
        stockQuantity: stock || 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setVariantError(data.error || "Failed to add variant");
      setAddingVariant(false);
      return;
    }

    setSelectedSize("");
    setSelectedColor("");
    setStock("");
    setAddingVariant(false);
    loadAll();
  }

  async function handleDeleteVariant(variantId) {
    if (!confirm("Remove this variant?")) return;
    await fetch(`/api/admin/variants/${variantId}`, { method: "DELETE" });
    loadAll();
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  if (!product || product.error) {
    return <p className="text-sm text-gray-400">Product not found.</p>;
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push("/admin/products")}
        className="text-sm text-gray-500 mb-4"
      >
        Back to Products
      </button>

      <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
      <p className="text-gray-500 text-sm mb-6">Manage sizes and colors</p>

      {/* Quick-add master size/color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="border border-gray-100 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Add a new size (e.g. 6, 7, 8)
          </p>
          <div className="flex gap-2">
            <input
              value={newSizeLabel}
              onChange={(e) => setNewSizeLabel(e.target.value)}
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
              placeholder="e.g. 7"
            />
            <button
              onClick={handleAddSize}
              className="shrink-0 bg-gray-900 text-white px-3 rounded-lg text-sm"
            >
              Add
            </button>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Add a new color</p>
          <div className="flex gap-2">
            <input
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
              placeholder="e.g. Black"
            />
            <button
              onClick={handleAddColor}
              className="shrink-0 bg-gray-900 text-white px-3 rounded-lg text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Add variant to this product */}
      <div className="border border-gray-100 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Add Size/Color for This Product</h2>

        {variantError ? (
          <p className="text-sm text-red-600 mb-2">{variantError}</p>
        ) : null}

        <form onSubmit={handleAddVariant} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            >
              <option value="">None</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            >
              <option value="">None</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={addingVariant}
            className="col-span-1 sm:col-span-3 bg-black text-white rounded-lg py-2 text-sm font-medium mt-1"
          >
            {addingVariant ? "Adding..." : "Add Variant"}
          </button>
        </form>
      </div>

      {/* Existing variants */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Existing Variants</h2>
        {product.variants && product.variants.length > 0 ? (
          <div className="space-y-2">
            {product.variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 gap-2"
              >
                <span className="text-sm">
                  {v.size ? v.size.label : "-"} / {v.color ? v.color.name : "-"} — Stock:{" "}
                  {v.stockQuantity}
                </span>
                <button
                  onClick={() => handleDeleteVariant(v.id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No variants added yet.</p>
        )}
      </div>
    </div>
  );
}