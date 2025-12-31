require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API Key kontrolü için küçük bir log (İşin bitince silebilirsin)
if (!process.env.GOOGLE_API_KEY) {
    console.error("HATA: .env dosyasında GOOGLE_API_KEY bulunamadı!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testBot() {
  try {
    // Model ismini tam olarak bu şekilde yazalım:
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Merhaba, orada mısın?");
    const response = await result.response;
    console.log("----------------------------");
    console.log("Botun Cevabı:", response.text());
    console.log("----------------------------");
  } catch (error) {
    // Hatayı daha detaylı görmek için objeyi yazdıralım
    console.error("Detaylı Hata:", error);
  }
}

testBot();