import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const KEYS = ["whatsapp_number", "business_name", "contact_number", "contact_email", "address"];

export async function GET() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: KEYS } },
  });

  const result = {};
  KEYS.forEach((key) => {
    const found = settings.find((s) => s.key === key);
    result[key] = found ? found.value : "";
  });

  return NextResponse.json(result);
}

export async function PUT(request) {
  const body = await request.json();

  const updates = Object.keys(body)
    .filter((key) => KEYS.includes(key))
    .map((key) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: body[key] || "" },
        create: { key, value: body[key] || "" },
      })
    );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}