import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function GET() {
  const srcDir = '/home/ali/Downloads/Telegram Desktop/Рекламные фото/2025.04.18 (Микрофоны)';
  const destDir = path.join(process.cwd(), 'public', 'microphones');

  try {
    // 1. Create destination folder if not exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // 2. Read source folder
    if (!fs.existsSync(srcDir)) {
      return NextResponse.json({ 
        success: false, 
        error: `Source directory does not exist: ${srcDir}` 
      }, { status: 400 });
    }

    const files = fs.readdirSync(srcDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    // 3. Copy files
    let copyCount = 0;
    imageFiles.forEach(file => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(srcPath, destPath);
      copyCount++;
    });

    // 4. Create Category "Микрофоны" / "Микрофондар"
    // Let's check if Category already exists
    let category = await prisma.category.findUnique({
      where: { name: "Микрофоны" }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "Микрофоны" }
      });
    }

    // 5. Seed products
    // We will generate different names and descriptions for microphones to make it look highly professional
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

    // Delete existing products under "Микрофоны" category to prevent duplication on multiple seed runs
    await prisma.product.deleteMany({
      where: { categoryId: category.id }
    });

    let seedCount = 0;
    const productsData = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const nameIdx = i % micNames.length;
      const micNum = i + 1;
      const name = `${micNames[nameIdx]} (Модель #${micNum})`;
      
      // Use Russian as default description in DB, we can handle dynamic translation or support multi-language description
      // Since schema doesn't have localized description, we can store a combined JSON or just Russian description,
      // and dynamically translate/adapt, or store Russian, or use our translation object.
      // Let's store a combined description or a structured description, or just store a clean description.
      // Actually, we can store Russian description and localize dynamically or store both in description.
      // Let's store Russian description. We can also make the code details page display bilingual or support translations.
      // Let's store: "RU: " + descriptionsRu[nameIdx] + " | KK: " + descriptionsKk[nameIdx]
      // Wait, let's store it as:
      const combinedDescription = JSON.stringify({
        ru: `${descriptionsRu[nameIdx]} Отличный выбор для профессионалов и любителей качественного звука.`,
        kk: `${descriptionsKk[nameIdx]} Кәсіби мамандар мен сапалы дыбысты ұнататындар үшін тамаша таңдау.`
      });

      const price = 45000 + (i * 12500) % 150000; // Generate realistic prices: 45,000 - 195,000 KZT

      const product = await prisma.product.create({
        data: {
          name,
          description: combinedDescription,
          price,
          imageUrl: `/microphones/${filename}`,
          kaspiLink: "https://kaspi.kz/shop/",
          categoryId: category.id
        }
      });
      productsData.push(product);
      seedCount++;
    }

    // Update settings copyright and hero text to Russian/Kazakh and ensure high quality
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

    return NextResponse.json({
      success: true,
      copiedImages: copyCount,
      seededProducts: seedCount,
      message: "Microphone setup and seeding completed successfully!"
    });

  } catch (error: any) {
    console.error("Setup API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || String(error)
    }, { status: 500 });
  }
}
