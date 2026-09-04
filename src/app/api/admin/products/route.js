import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: true, category: true, images: true },
  });
  return NextResponse.json(products);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      brandId,
      categoryId,
      shortDescription,
      description,
      price,
      mrp,
      material,
      soleType,
      heelType,
      pattern,
      occasion,
      sku,
      status,
      images, // array of URLs
    } = body;

    if (!name || !price || !sku) {
      return NextResponse.json(
        { error: "Name, price, and SKU are required" },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brandId: brandId || null,
        categoryId: categoryId || null,
        shortDescription: shortDescription || null,
        description: description || null,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        material: material || null,
        soleType: soleType || null,
        heelType: heelType || null,
        pattern: pattern || null,
        occasion: occasion || null,
        sku,
        status: status || "AVAILABLE",
        images: {
          create: (images || []).map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}