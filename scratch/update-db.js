const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Updating product image URLs in local database...");
    
    const u1 = await prisma.product.updateMany({
      where: { name: "DAUYS D-ONE Handheld" },
      data: { imageUrl: "/microphones/20250419084630_v2.jpg" }
    });
    console.log(`Updated ${u1.count} handheld products.`);

    const u2 = await prisma.product.updateMany({
      where: { name: "DAUYS D-ONE Beltpack" },
      data: { imageUrl: "/microphones/20250419084620_v2.jpg" }
    });
    console.log(`Updated ${u2.count} beltpack products.`);

    console.log("Database update finished.");
  } catch (error) {
    console.error("Failed to update database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
