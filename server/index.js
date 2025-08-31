const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mesaj gerekli' });
    }

    // Conversation context oluştur
    const messages = [
      {
        role: 'system',
        content: `Sen bir seyahat rota planlayıcısısın. Amacın kullanıcılar için kişiselleştirilmiş seyahat rotaları oluşturmaktır.

ÖNEMLİ: Rota oluşturmadan önce aşağıdaki TÜM bilgileri toplamalısın:

1. 🎯 DESTİNASYON: Nereye gidecekleri
2. 👥 KİŞİ SAYISI: Kaç kişi gidecek
3. 📅 SÜRE: Kaç gün kalacakları
4. 🏨 KONAKLAMA TİPİ: Nasıl bir konaklama istiyorlar (otel, airbnb, villa, hostel, resort vs.)
5. 💰 BÜTÇE: Toplam bütçe bilgisi

BU BİLGİLERİN HEPSİNİ ALMADAN ROTA OLUŞTURMA! 

Kullanıcı eksik bilgi verirse, nazikçe eksik bilgiyi sor. Örnek:
"Harika! Muğla'ya gitmek istiyorsunuz. Size en uygun rotayı oluşturmak için birkaç bilgi daha almam gerekiyor:
- Kaç kişi gideceksiniz?
- Kaç gün kalacaksınız?
- Nasıl bir konaklama istiyorsunuz? (otel, airbnb, villa vs.)
- Bütçeniz ne kadar?"

Tüm bilgileri aldıktan sonra:
- Detaylı günlük rota oluştur
- Konaklama önerileri ver
- Aktivite önerileri sun
- Ulaşım bilgileri ekle
- Bütçe dağılımı yap

Türkçe konuş, samimi ve yardımsever ol. Seyahat tutkunu bir arkadaş gibi davran.`
      },
      ...conversationHistory.slice(-10), // Son 10 mesajı al (context limit)
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt veremiyorum.';

    res.json({ response });

  } catch (error) {
    console.error('OpenAI API Hatası:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'API kotası tükendi. Lütfen daha sonra tekrar deneyin.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Geçersiz API anahtarı. Lütfen yönetici ile iletişime geçin.' 
      });
    }

    res.status(500).json({ 
      error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📡 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Bağlı' : '❌ Bağlantı yok'}`);
});
