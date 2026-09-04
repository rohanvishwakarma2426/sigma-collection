const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@sigmacollection.com"; // apna email daal sakte ho
  const password = "Admin@123";              // apna password daal sakte ho, strong rakhna
  const name = "Owner";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name, role: "owner" },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());