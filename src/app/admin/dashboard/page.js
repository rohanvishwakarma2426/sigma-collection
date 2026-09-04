"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-red-500 text-sm">Could not load dashboard data.</p>;
  }

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Available", value: stats.available },
    { label: "Incoming", value: stats.incoming },
    { label: "Out of Stock", value: stats.outOfStock },
    { label: "Total Enquiries", value: stats.totalEnquiries },
    { label: "New Enquiries", value: stats.newEnquiries },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Overview of your store</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Products</h2>
          <Link href="/admin/products" className="text-sm text-gray-500 underline">
            View all
          </Link>
        </div>
        {stats.recentProducts.length === 0 ? (
          <p className="text-sm text-gray-400">No products yet. Add your first one!</p>
        ) : (
          <div className="space-y-2">
            {stats.recentProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{p.name}</span>
                <span className="text-xs text-gray-500">{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent enquiries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-gray-500 underline">
            View all
          </Link>
        </div>
        {stats.recentEnquiries.length === 0 ? (
          <p className="text-sm text-gray-400">No enquiries yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentEnquiries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{e.customerName}</span>
                <span className="text-xs text-gray-500">{e.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}