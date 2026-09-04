const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "918922900126" }, // apna real number yahan daalo, country code ke saath, no + or spaces
    create: { key: "whatsapp_number", value: "918922900126" },
  });
  console.log("WhatsApp number saved.");
}

main().finally(() => prisma.$disconnect());