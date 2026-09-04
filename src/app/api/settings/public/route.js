import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const whatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp_number" } });
  return NextResponse.json({
    whatsappNumber: whatsapp?.value || null,
  });
}