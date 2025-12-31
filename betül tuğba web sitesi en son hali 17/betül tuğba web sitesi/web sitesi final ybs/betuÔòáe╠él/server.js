require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

console.log("GENAI PACKAGE PATH:", require.resolve("@google/genai"));

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Frontend dosyalarını servis et
app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.PORT || 3000;

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 60_000, // 1 dakika
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' }
});

// Google Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

app.post('/api/chat', apiLimiter, async (req, res) => {
  try {
    const message =
      req.body.message ||
      req.body.prompt ||
      req.body.mesaj ||
      '';

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    // Backend API key kontrolü (opsiyonel)
    const expected = process.env.BACKEND_API_KEY;
    if (expected) {
      const provided =
        (req.headers['authorization'] || req.headers['x-api-key'] || '')
          .toString();

      let token = provided;
      if (token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7).trim();
      }

      if (!token || token !== expected) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // DEMO MODE
    if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_API_KEY) {
      return res.json({
        reply:
          "🤖 Demo modundayım. Gerçek yanıtlar için GOOGLE_API_KEY eklemelisin."
      });
    }

    // OpenAI varsa onu kullan
    if (process.env.OPENAI_API_KEY) {
      const openaiResp = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
          max_tokens: 800
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const reply =
        openaiResp.data?.choices?.[0]?.message?.content || '';

      return res.json({ reply });
    }

    // GOOGLE GEMINI (gemini-pro)
    if (process.env.GOOGLE_API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(message);
      const response = await result.response;
      const reply = response.text();

      return res.json({ reply });
    }

    return res.status(500).json({
      error: 'No AI API key configured'
    });

  } catch (err) {
    console.error('Error in /api/chat:', err);

    return res.json({
      reply:
        "🤖 Şu anda Gemini API'ye ulaşılamıyor (kota / billing / rate limit olabilir)."
    });
  }
});

// Vision endpoint ŞİMDİLİK KAPALI
app.post('/api/vision', apiLimiter, async (req, res) => {
  res.status(501).json({
    error: 'Vision endpoint temporarily disabled'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
