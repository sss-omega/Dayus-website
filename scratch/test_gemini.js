

async function testGemini() {
  const apiKey = ""; // Key from route.ts
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "хочу ее купить" }] }],
      systemInstruction: {
        parts: [{ text: `Вы — интеллектуальный AI-ассистент компании DAUYS.
[КРИТИЧЕСКИ ВАЖНЫЙ КОНТЕКСТ]:
Вы БУКВАЛЬНО "ВИДИТЕ", на какую страницу смотрит пользователь. Прямо сейчас у него перед глазами страница товара: "DAUYS D-ONE Handheld".

ИНСТРУКЦИЯ ПО ОФОРМЛЕНИЮ ПОКУПКИ:
Если пользователь пишет, что хочет "купить", "приобрести", "оформить заказ" или "давай купим вот этот товар", вы ДОЛЖНЫ ВЫПОЛНИТЬ РОВНО ДВА ДЕЙСТВИЯ:
1. Кратко ответить, что перенаправляете его в магазин (например: "Отлично! Сейчас я открою для вас страницу товара на Kaspi.kz для оформления заказа.").
2. В самом конце ответа ВСТАВИТЬ СЕКРЕТНУЮ КОМАНДУ: [REDIRECT: https://kaspi.kz/shop/search/?q=DAUYS%20D-ONE]
ВАЖНО: Больше ничего не пишите, обычные ссылки (начинающиеся с http) в тексте не давайте! Обязательно используйте формат с квадратными скобками [REDIRECT: ссылка].` }]
      },
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
    })
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

testGemini();
