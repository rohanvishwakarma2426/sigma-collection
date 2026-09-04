"use client";

import { useEffect, useState } from "react";

const statusColors = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id, status) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Enquiries</h1>
      <p className="text-gray-500 text-sm mb-6">{enquiries.length} total</p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-sm text-gray-400">No enquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{e.customerName}</p>
                  <p className="text-xs text-gray-500">{e.customerPhone}</p>
                  {e.customerEmail ? (
                    <p className="text-xs text-gray-500">{e.customerEmail}</p>
                  ) : null}
                </div>
                <select
                  value={e.status}
                  onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                  className={`text-xs rounded-full px-2 py-1 border-0 ${statusColors[e.status]}`}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {e.items && e.items.length > 0 ? (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  {e.items.map((item) => (
                    <p key={item.id} className="text-xs text-gray-600">
                      {item.product ? item.product.name : "Product"} x {item.quantity}
                    </p>
                  ))}
                </div>
              ) : null}

              {e.message ? (
                <p className="text-xs text-gray-500 mt-2 italic">"{e.message}"</p>
              ) : null}

              <p className="text-xs text-gray-400 mt-2">
                {new Date(e.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}