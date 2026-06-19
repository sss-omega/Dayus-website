const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking categories and products in DB...");
    const allCategories = await prisma.category.findMany({
      include: { products: true }
    });

    console.log("Current DB Status:");
    for (const cat of allCategories) {
      console.log(`Category: "${cat.name}" (ID: ${cat.id}) has ${cat.products.length} products`);
      for (const prod of cat.products) {
        console.log(`  - Product: "${prod.name}" (ID: ${prod.id})`);
      }
    }

    console.log("\nDeleting all categories except 'Микрофоны' and all products not in 'Микрофоны'...");
    
    // Find 'Микрофоны' category
    const micCategory = await prisma.category.findUnique({
      where: { name: "Микрофоны" }
    });

    if (micCategory) {
      // Delete products not in 'Микрофоны'
      const deletedProducts = await prisma.product.deleteMany({
        where: {
          categoryId: { not: micCategory.id }
        }
      });
      console.log(`Deleted ${deletedProducts.count} products not belonging to 'Микрофоны'.`);

      // Delete categories other than 'Микрофоны'
      const deletedCategories = await prisma.category.deleteMany({
        where: {
          id: { not: micCategory.id }
        }
      });
      console.log(`Deleted ${deletedCategories.count} categories other than 'Микрофоны'.`);

      // Keep only our 2 premium products in 'Микрофоны'
      const activeProducts = await prisma.product.findMany({
        where: { categoryId: micCategory.id }
      });

      console.log(`Products remaining in 'Микрофоны': ${activeProducts.length}`);
      for (const p of activeProducts) {
        if (p.name !== "DAUYS D-ONE Handheld" && p.name !== "DAUYS D-ONE Beltpack") {
          await prisma.product.delete({ where: { id: p.id } });
          console.log(`Deleted extraneous product: "${p.name}"`);
        }
      }
    } else {
      console.log("Category 'Микрофоны' not found.");
    }

    console.log("\nFinished cleaning. Let's list final products:");
    const finalProducts = await prisma.product.findMany({
      include: { category: true }
    });
    for (const p of finalProducts) {
      console.log(`  - Product: "${p.name}" (ID: ${p.id}) in Category: "${p.category.name}"`);
    }

  } catch (error) {
    console.error("Error running cleaning script:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
