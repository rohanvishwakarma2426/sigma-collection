import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where = {
    status: { in: ["AVAILABLE", "INCOMING"] }, // never show HIDDEN or let public browse OUT_OF_STOCK differently if needed
  };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where,
    include: { images: true, brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}