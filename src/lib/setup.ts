import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function runSetupIfNeeded() {
  const srcDir = '/home/ali/Downloads/Telegram Desktop/Рекламные фото/2025.04.18 (Микрофоны)';
  const destDir = path.join(process.cwd(), 'public', 'microphones');

  try {
    // Check if category "Микрофоны" already exists and has products
    const existingCategory = await prisma.category.findUnique({
      where: { name: "Микрофоны" },
      include: { _count: { select: { products: true } } }
    });

    const hasProducts = existingCategory && existingCategory._count.products > 0;
    const destExists = fs.existsSync(destDir);
    const destFilesCount = destExists ? fs.readdirSync(destDir).length : 0;

    // If we already have seeded products and copied files, skip setup to maintain high performance
    if (hasProducts && destFilesCount > 0) {
      return { success: true, message: "Setup already completed previously." };
    }

    console.log("Starting automatic setup and seed for microphones...");

    // 1. Create destination directory if not exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // 2. Scan destination directory for already copied files
    let imageFiles = fs.readdirSync(destDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    let copyCount = 0;

    // 3. If destination directory is empty, try to copy from source
    if (imageFiles.length === 0) {
      if (!fs.existsSync(srcDir)) {
        console.warn(`Source directory not found: ${srcDir} and public/microphones is empty. Skipping.`);
        return { success: false, error: "No images found." };
      }

      console.log(`Copying images from host source: ${srcDir}...`);
      const files = fs.readdirSync(srcDir);
      const hostImageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
      });

      hostImageFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        fs.copyFileSync(srcPath, destPath);
        imageFiles.push(file);
        copyCount++;
      });
    } else {
      console.log(`Found ${imageFiles.length} images already in public/microphones.`);
    }

    if (imageFiles.length === 0) {
      console.warn("No images found to seed.");
      return { success: false, error: "No images found." };
    }

    // 5. Ensure "Микрофоны" category exists
    let category = await prisma.category.findUnique({
      where: { name: "Микрофоны" }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "Микрофоны" }
      });
    }

    // 6. Seed products
    const micNames = [
      "DAUYS Vocal Pro X",
      "DAUYS Studio Master 800",
      "DAUYS Wireless Duo-Stage",
      "DAUYS Broadcast Elite",
      "DAUYS Podcast Creator",
      "DAUYS Lav-Pro Wireless",
      "DAUYS Instrument Ribbon",
      "DAUYS Condenser Classic",
      "DAUYS Dynamic Stage-1",
      "DAUYS Field Recorder Mic"
    ];

    const descriptionsRu = [
      "Профессиональный вокальный микрофон премиум-класса с кристально чистым звучанием.",
      "Студийный конденсаторный микрофон с большой диафрагмой для записи вокала и инструментов.",
      "Двухканальная беспроводная радиосистема для сцены и презентаций.",
      "Микрофон вещательного качества для радиовещания и озвучивания.",
      "USB-микрофон для подкастов и стриминга с регулировкой чувствительности.",
      "Беспроводной петличный микрофон высокой четкости для блогеров и интервью.",
      "Ленточный микрофон с теплым винтажным звуком для акустических инструментов.",
      "Классический студийный микрофон с кардиоидной диаграммой направленности.",
      "Динамический сценический микрофон с высокой устойчивостью к обратной связи.",
      "Репортерский микрофон для качественной записи в полевых условиях."
    ];

    const descriptionsKk = [
      "Кристалдай таза дыбысы бар премиум-класты кәсіби вокалдық микрофон.",
      "Вокал мен аспаптарды жазуға арналған үлкен диафрагмалы студиялық конденсаторлық микрофон.",
      "Сахна мен презентацияларға арналған екі арналы сымсыз радиожүйе.",
      "Радиохабар тарату және дыбыстау үшін хабар тарату сапасындағы микрофон.",
      "Сезімталдығы реттелетін подкасттар мен стримингке арналған USB микрофоны.",
      "Блогерлер мен сұхбаттарға арналған жоғары дәлдіктегі сымсыз ілмекті микрофон.",
      "Акустикалық аспаптарға арналған жылы винтажды дыбысы бар таспалы микрофон.",
      "Кардиоидты бағыты бар классикалық студиялық микрофон.",
      "Кері байланысқа жоғары тұрақтылығы бар динамикалық сахналық микрофон.",
      "Далалық жағдайда сапалы жазуға арналған репортерлық микрофон."
    ];

    // Clear existing products in "Микрофоны" category if we are running seed again
    await prisma.product.deleteMany({
      where: { categoryId: category.id }
    });

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const nameIdx = i % micNames.length;
      const micNum = i + 1;
      const name = `${micNames[nameIdx]} (Модель #${micNum})`;
      
      const combinedDescription = JSON.stringify({
        ru: `${descriptionsRu[nameIdx]} Отличный выбор для профессионалов и любителей качественного звука.`,
        kk: `${descriptionsKk[nameIdx]} Кәсіби мамандар мен сапалы дыбысты ұнататындар үшін тамаша таңдау.`
      });

      const price = 45000 + (i * 12500) % 150000;

      await prisma.product.create({
        data: {
          name,
          description: combinedDescription,
          price,
          imageUrl: `/microphones/${filename}`,
          kaspiLink: "https://kaspi.kz/shop/",
          categoryId: category.id
        }
      });
    }

    // Set site settings defaults
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        headerTitle: "DAUYS",
        footerText: "© 2026 DAUYS. Барлық құқықтар қорғалған. | Все права защищены.",
        heroTitle: "Шынайы Дыбыс Әлемі",
        heroDesc: "Аудиофилдерге арналған премиум микрофондар мен акустикалық жүйелер. Кристалды таза дыбысты бүгін сезініңіз."
      },
      create: {
        id: 1,
        headerTitle: "DAUYS",
        footerText: "© 2026 DAUYS. Барлық құқықтар қорғалған. | Все права защищены.",
        heroTitle: "Шынайы Дыбыс Әлемі",
        heroDesc: "Аудиофилдерге арналған премиум микрофондар мен акустикалық жүйелер. Кристалды таза дыбысты бүгін сезініңіз."
      }
    });

    console.log(`Successfully copied ${copyCount} images and seeded ${imageFiles.length} microphone products.`);
    return { success: true, copied: copyCount, seeded: imageFiles.length };

  } catch (error) {
    console.error("Error running setup helper:", error);
    return { success: false, error: String(error) };
  }
}
