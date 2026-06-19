import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductClient from "@/components/ProductClient";

export const dynamic = "force-dynamic";

const T = {
  ru: {
    backToStore: "← Назад",
    inStock: "В НАЛИЧИИ",
    priceReq: "Цена по запросу",
    buyBtn: "Купить на Kaspi.kz",
    notAvail: "Нет в наличии",
    noDesc: "Описание отсутствует",
    specifications: "Характеристики",
    manualTitle: "Инструкция по эксплуатации",
    setupSection: "Установка и подключение",
    syncSection: "Синхронизация и частоты",
    screenSection: "Управление и эхо",
    powerSection: "Чувствительность и питание",
    buyBottomTitle: "Приобрести прямо сейчас",
    buyBottomDesc: "Быстрая доставка и оплата в рассрочку на Kaspi.kz",
    buyBottomBtn: "Купить на Kaspi.kz",
    feat1Title: "Кристальная чистота звука",
    feat1Stat: ">96 дБ",
    feat1StatLabel: "Динамический диапазон",
    feat1Desc: "Передовая цифровая беспроводная технология обеспечивает исключительно чистый звук без шумов и помех. Отношение сигнал/шум более 96 дБ — профессиональный стандарт для студий и больших сцен.",
    feat2Title: "Свобода движения",
    feat2Stat: "80M",
    feat2StatLabel: "Дальность без помех",
    feat2Desc: "Схемы разнесения антенн гарантируют полное отсутствие мёртвых зон в рабочей зоне. Идеально для больших сцен, концертных залов и презентационных площадок.",
    feat3Title: "Весь день без подзарядки",
    feat3Stat: "8H+",
    feat3StatLabel: "Автономная работа",
    feat3Desc: "Встроенный литиевый аккумулятор 18650 (3.7В) обеспечивает более 8 часов непрерывной работы. Зарядка через универсальный порт Type-C прямо в корпусе передатчика.",
    feat4Title: "Автосинхронизация 2.4G",
    feat4Stat: "2.4G",
    feat4StatLabel: "Авто синхронизация",
    feat4Desc: "Технология двунаправленной синхронизации данных позволяет мгновенно сопрягать приёмник и передатчик. Автоматический выбор частоты с обходом помех — никаких ручных настроек.",
  },
  kk: {
    backToStore: "← Артқа",
    inStock: "БАР",
    priceReq: "Бағасы сұраныс бойынша",
    buyBtn: "Kaspi.kz-тен сатып алу",
    notAvail: "Қолжетімсіз",
    noDesc: "Сипаттама жоқ",
    specifications: "Сипаттамалар",
    manualTitle: "Пайдалану нұсқаулығы",
    setupSection: "Орнату және қосылым",
    syncSection: "Синхрондау және жиіліктер",
    screenSection: "Басқару және жаңғырық",
    powerSection: "Сезімталдық және қорек",
    buyBottomTitle: "Қазір сатып алу",
    buyBottomDesc: "Kaspi.kz арқылы жылдам жеткізу және бөліп төлеу",
    buyBottomBtn: "Kaspi.kz-тен сатып алу",
    feat1Title: "Кристалдай таза дыбыс",
    feat1Stat: ">96 дБ",
    feat1StatLabel: "Динамикалық диапазон",
    feat1Desc: "Озық цифрлық сымсыз технология шу мен кедергісіз ерекше таза дыбысты қамтамасыз етеді. Сигнал/шу қатынасы 96 дБ-ден жоғары — студиялар мен үлкен сахналар үшін кәсіби стандарт.",
    feat2Title: "Қозғалыс еркіндігі",
    feat2Stat: "80М",
    feat2StatLabel: "Кедергісіз жұмыс қашықтығы",
    feat2Desc: "Антенна схемалары жұмыс аймағында өлі нүктелердің болмауына кепілдік береді. Үлкен сахналарға, концерт залдарына өте қолайлы.",
    feat3Title: "Бүкіл күн зарядсыз",
    feat3Stat: "8СҒ+",
    feat3StatLabel: "Автономды жұмыс",
    feat3Desc: "Кірістірілген 18650 (3.7В) литий аккумуляторы 8 сағаттан астам үздіксіз жұмысты қамтамасыз етеді. Type-C порты арқылы зарядтау.",
    feat4Title: "2.4G автосинхрондау",
    feat4Stat: "2.4G",
    feat4StatLabel: "Автосинхрондау",
    feat4Desc: "Екіжақты синхрондау технологиясы қабылдағыш пен таратқышты лезде жұптастырады. Кедергілерді автоматты айналып өту — қолмен реттеу қажет емес.",
  },
};

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 2,
  });

  const locale = cookies().get("NEXT_LOCALE")?.value === "kk" ? "kk" : "ru";
  const t = T[locale];

  let displayDesc = product.description || t.noDesc;
  if (product.description && product.description.startsWith("{")) {
    try {
      const d = JSON.parse(product.description);
      displayDesc = d[locale] || d.ru || d.kk || product.description;
    } catch (_e) { /* ignore */ }
  }

  const rawSpecs = locale === "kk" ? product.specsKk : product.specsRu;
  const specs: { key: string; value: string }[] = [];
  if (rawSpecs) {
    for (const line of rawSpecs.split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        specs.push({ key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() });
      }
    }
  }

  const relatedPlain = related.map((r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    imageUrl: r.imageUrl,
    description: r.description,
  }));

  return (
    <main>
      <ProductClient
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          galleryUrls: product.galleryUrls,
          kaspiLink: product.kaspiLink,
          category: { name: product.category.name },
        }}
        displayDesc={displayDesc}
        specs={specs}
        relatedProducts={relatedPlain}
        locale={locale}
        t={t}
      />
    </main>
  );
}
