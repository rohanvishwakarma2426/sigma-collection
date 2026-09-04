"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [slug]);

  function handleAddToCart() {
    addItem(product, 1);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 1500);
  }

  if (loading) {
    return <p className="p-4 text-sm text-gray-400">Loading...</p>;
  }

  if (!product || product.error) {
    return <p className="p-4 text-sm text-gray-400">Product not found.</p>;
  }

  const isOrderable = product.status === "AVAILABLE";

  return (
    <main className="min-h-screen bg-white pb-28">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-lg">
          Back
        </Link>
        <h1 className="text-sm font-medium truncate">{product.name}</h1>
      </header>

      <div className="aspect-square bg-gray-100 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[activeImage].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No Image
          </div>
        )}
        {product.status === "INCOMING" && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full">
            Incoming Soon
          </span>
        )}
        {product.status === "OUT_OF_STOCK" && (
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {product.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                activeImage === i ? "border-black" : "border-transparent"
              }`}
            >
              <img src={img.url} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 pt-2">
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}
        <h2 className="text-xl font-bold">{product.name}</h2>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold">Rs. {product.price}</span>
          {product.mrp && Number(product.mrp) > Number(product.price) && (
            <span className="text-sm text-gray-400 line-through">Rs. {product.mrp}</span>
          )}
        </div>

        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-2">{product.shortDescription}</p>
        )}

        <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
          {product.material && (
            <div>
              <span className="text-gray-400">Material:</span> {product.material}
            </div>
          )}
          {product.soleType && (
            <div>
              <span className="text-gray-400">Sole:</span> {product.soleType}
            </div>
          )}
          {product.heelType && (
            <div>
              <span className="text-gray-400">Heel:</span> {product.heelType}
            </div>
          )}
          {product.occasion && (
            <div>
              <span className="text-gray-400">Occasion:</span> {product.occasion}
            </div>
          )}
        </div>

        {product.description && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 space-y-2">
        {addedMessage ? (
          <p className="text-center text-sm text-green-600 mb-1">Added to cart!</p>
        ) : null}

        {isOrderable ? (
          <>
            <button
              onClick={handleAddToCart}
              className="block w-full border border-black text-black text-center rounded-lg py-3 text-sm font-medium"
            >
              Add to Cart
            </button>
            <Link
              href={`/enquiry?product=${product.slug}`}
              className="block w-full bg-black text-white text-center rounded-lg py-3 text-sm font-medium"
            >
              I'm Interested
            </Link>
          </>
        ) : (
          <div className="w-full bg-gray-100 text-gray-500 text-center rounded-lg py-3 text-sm font-medium">
            {product.status === "INCOMING"
              ? "Coming Soon — Not Orderable Yet"
              : "Currently Unavailable"}
          </div>
        )}
      </div>
    </main>
  );
}