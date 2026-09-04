"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    whatsapp_number: "",
    business_name: "",
    contact_number: "",
    contact_email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Business information used across the site</p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            value={form.business_name}
            onChange={(e) => updateField("business_name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="Sigma Collection"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
          <input
            value={form.whatsapp_number}
            onChange={(e) => updateField("whatsapp_number", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="919876543210 (country code + number, no spaces)"
          />
          <p className="text-xs text-gray-400 mt-1">
            Used for the "I'm Interested" WhatsApp button
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            value={form.contact_number}
            onChange={(e) => updateField("contact_number", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => updateField("contact_email", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {saved ? (
          <p className="text-sm text-green-600">Settings saved.</p>
        ) : null}
      </form>
    </div>
  );
}