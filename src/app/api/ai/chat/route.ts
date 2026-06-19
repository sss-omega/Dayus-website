import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, currentPath } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Get or Create Session
    let session = null;
    if (sessionId) {
      try {
        session = await prisma.chatSession.findUnique({
          where: { id: sessionId },
          include: { messages: { orderBy: { createdAt: "asc" } } }
        });
      } catch (err) {
        console.warn("Invalid session ID format, creating new session:", err);
      }
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {},
        include: { messages: { orderBy: { createdAt: "asc" } } }
      });
    }

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "user",
        text: message
      }
    });

    // 2. Load AI Knowledge Base and Product Information
    const knowledges = await prisma.aiKnowledge.findMany({
      orderBy: { createdAt: "asc" }
    });
    const knowledgeText = knowledges.map((k) => k.content).join("\n\n");

    const products = await prisma.product.findMany({
      include: { category: true }
    });
    const productsText = products.map((p) => {
      return `Товар: ${p.name}\nКатегория: ${p.category ? p.category.name : "Микрофоны"}\nЦена: ${p.price ? `${p.price.toLocaleString()} KZT` : "По запросу"}\nОписание: ${p.description || "Нет описания"}\nХарактеристики (RU): ${p.specsRu || "Нет"}\nХарактеристики (KK): ${p.specsKk || "Нет"}\nСсылка: ${p.kaspiLink || "Нет"}`;
    }).join("\n\n---\n\n");

    // Check if user is looking at a specific product page
    let activeProductContext = "";
    if (currentPath && currentPath.includes("/product/")) {
      const match = currentPath.match(/\/product\/(\d+)/);
      if (match && match[1]) {
        const prodId = parseInt(match[1], 10);
        const activeProduct = products.find((p) => p.id === prodId);
        if (activeProduct) {
          activeProductContext = `\n[КРИТИЧЕСКИ ВАЖНЫЙ КОНТЕКСТ]:
Вы БУКВАЛЬНО "ВИДИТЕ", на какую страницу смотрит пользователь. Прямо сейчас у него перед глазами страница товара: "${activeProduct.name}".
Если пользователь спрашивает "что я смотрю", "какой аппарат у меня на глазах" или "что это", вы ДОЛЖНЫ уверенно ответить: "Вы сейчас смотрите на страницу товара ${activeProduct.name}".
Все контекстные вопросы (например: "сколько стоит?", "какие характеристики?") в первую очередь относятся к этому товару: "${activeProduct.name}".

ИНСТРУКЦИЯ ПО ОФОРМЛЕНИЮ ПОКУПКИ:
Если пользователь пишет, что хочет "купить", "приобрести", "оформить заказ" или "давай купим вот этот товар", вы ДОЛЖНЫ ВЫПОЛНИТЬ РОВНО ДВА ДЕЙСТВИЯ:
1. Кратко ответить, что перенаправляете его в магазин (например: "Отлично! Сейчас я открою для вас страницу товара на Kaspi.kz для оформления заказа.").
2. В самом конце ответа ВСТАВИТЬ СЕКРЕТНУЮ КОМАНДУ: [REDIRECT: ${activeProduct.kaspiLink}]
ВАЖНО: Больше ничего не пишите, обычные ссылки (начинающиеся с http) в тексте не давайте! Обязательно используйте формат с квадратными скобками [REDIRECT: ссылка].`;
        }
      }
    } else if (currentPath === "/" || currentPath === "" || currentPath === "/ru" || currentPath === "/kk") {
      activeProductContext = `\n[КРИТИЧЕСКИ ВАЖНЫЙ КОНТЕКСТ]:\nВы БУКВАЛЬНО "ВИДИТЕ" экран пользователя. Сейчас он находится на главной странице каталога продукции.`;
    }

    // 3. Construct System Instruction
    const systemInstruction = `Вы — интеллектуальный AI-ассистент компании DAUYS (магазин премиальных микрофонов и звукового оборудования).
Ваша задача — помогать посетителям сайта, отвечать на вопросы о продукции, ценах, характеристиках и условиях эксплуатации.

Отвечайте вежливо, кратко и лаконично (не пишите гигантские абзацы текста, если об этом не просят). Всегда пишите на том же языке, на котором обратился клиент (русский или казахский).
Используйте только достоверную информацию о товарах и правилах использования, приведенную ниже. Если информации нет в контексте, вежливо скажите, что не владеете данной информацией и предложите обратиться в поддержку.
${activeProductContext}

БАЗА ЗНАНИЙ И ИНСТРУКЦИИ:
${knowledgeText}

СПИСОК АКТУАЛЬНЫХ ТОВАРОВ И ЦЕН В МАГАЗИНЕ DAUYS:
${productsText}

Важно: Не придумывайте цены, характеристики или несуществующие товары. Отвечайте строго на основе предоставленных данных. Если клиент спрашивает про Kaspi, упомяните, что можно купить товары в рассрочку/кредит через Kaspi.kz по прямым ссылкам на страницах товаров.`;

    // 4. Build Conversation History
    const rawHistory = session.messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      text: m.text
    }));
    
    // Add current user message
    rawHistory.push({
      role: "user",
      text: message
    });

    // Merge consecutive messages from the same sender to satisfy Gemini's alternating roles constraint
    const history: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of rawHistory) {
      if (history.length > 0 && history[history.length - 1].role === msg.role) {
        history[history.length - 1].parts[0].text += "\n" + msg.text;
      } else {
        history.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      }
    }

    // Ensure it begins with a user message
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    // 5. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY || "";
    // We use gemini-2.5-flash as the requested model
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: history,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error status:", response.status, errText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resData = await response.json();
    const aiResponseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      console.error("Gemini invalid response structure:", JSON.stringify(resData));
      throw new Error("Invalid response from Gemini API");
    }

    // Save AI response to database
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "ai",
        text: aiResponseText
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      response: aiResponseText
    });

  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
