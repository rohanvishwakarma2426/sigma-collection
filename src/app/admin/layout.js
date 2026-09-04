"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page has no sidebar
  if (pathname === "/admin/login") {
    return children;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Sidebar - desktop */}
      <aside className="hidden sm:flex sm:flex-col w-56 border-r border-gray-100 p-4">
        <h2 className="font-bold text-lg mb-6 px-2">Sigma Admin</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm ${
                pathname === item.href
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 text-left"
        >
          Log out
        </button>
      </aside>

      {/* Top bar - mobile */}
      <header className="sm:hidden flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="font-bold">Sigma Admin</h2>
        <button onClick={handleLogout} className="text-sm text-red-600">
          Log out
        </button>
      </header>

      {/* Bottom nav - mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex overflow-x-auto z-10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 text-center py-2.5 text-xs whitespace-nowrap px-2 ${
              pathname === item.href ? "text-black font-semibold" : "text-gray-500"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 pb-20 sm:pb-6">{children}</main>
    </div>
  );
}