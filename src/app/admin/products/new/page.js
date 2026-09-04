"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    mrp: "",
    categoryId: "",
    brandId: "",
    shortDescription: "",
    description: "",
    material: "",
    soleType: "",
    heelType: "",
    pattern: "",
    occasion: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/admin/brands").then((r) => r.json()).then(setBrands);
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) uploadedUrls.push(data.url);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.sku) {
      setError("Name, price, and SKU are required.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create product");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Add Product</h1>
      <p className="text-gray-500 text-sm mb-6">Fill in the product details</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Images</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((url) => (
              <div key={url} className="relative w-20 h-20">
                <img src={url} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              placeholder="e.g. Classic Block Heel Sandal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input
              value={form.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              placeholder="e.g. SC-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="AVAILABLE">Available</option>
              <option value="INCOMING">Incoming</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₹) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">MRP (₹)</label>
            <input
              type="number"
              value={form.mrp}
              onChange={(e) => updateField("mrp", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              value={form.brandId}
              onChange={(e) => updateField("brandId", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="One-line summary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input
              value={form.material}
              onChange={(e) => updateField("material", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sole Type</label>
            <input
              value={form.soleType}
              onChange={(e) => updateField("soleType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heel Type</label>
            <input
              value={form.heelType}
              onChange={(e) => updateField("heelType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Occasion</label>
            <input
              value={form.occasion}
              onChange={(e) => updateField("occasion", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}