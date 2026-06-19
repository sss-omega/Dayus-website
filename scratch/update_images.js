const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://admin:adminpassword@194.238.41.67:5435/dauys_db?schema=public"
    }
  }
});

async function main() {
  await prisma.product.updateMany({
    where: { name: "DAUYS D-ONE Handheld" },
    data: { imageUrl: "/microphones/20250419084620_v2.jpg" }
  });
  await prisma.product.updateMany({
    where: { name: "DAUYS D-ONE Beltpack" },
    data: { imageUrl: "/microphones/20250419084630_v2.jpg" }
  });
  console.log("Images updated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
