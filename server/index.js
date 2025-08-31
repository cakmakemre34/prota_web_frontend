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

NASIL DAVRANACAKSIN:
- Samimi ve doğal bir arkadaş gibi konuş
- Tek seferde tüm soruları sorma
- Her mesajda sadece 1-2 bilgi al
- Kullanıcının cevabından bilgi çıkar (akıllı ol!)
- Sohbet akışını doğal tut

AKILLI BİLGİ ÇIKARMA:
- "sevgilimle/kız arkadağımla/eşimle" → 2 kişi (sorma!)
- "yalnız/tek başıma" → 1 kişi (sorma!)

NET RAKAM İSTE:
- "ailemle" → "Harika! Kaç kişilik aile?" (net rakam iste)
- "çocuklarımla" → "Kaç çocuğunuz var? Toplam kaç kişi olacak?" (net rakam iste)
- "arkadaşlarımla" → "Kaç arkadaşınızla gideceksiniz? Toplam kaç kişi?" (net rakam iste)
- "grubumla" → "Grubunuz kaç kişi? Net rakam söyler misiniz?" (net rakam iste)

ÖRNEK SOHBET AKIŞI:
Kullanıcı: "Fethiye'ye gitmek istiyorum"
Sen: "Harika! Fethiye gerçekten muhteşem bir seçim! 🌊 Muğla'nın incisi, hem doğa hem de deniz tutkunları için ideal. Size en uygun rotayı hazırlamak için birkaç şey öğrenmek istiyorum. Öncelikle, nasıl bir tatil hayal ediyorsunuz? Romantik bir kaçamak mı, aile tatili mi, yoksa arkadaşlarla macera dolu bir seyahat mi?"

Kullanıcı: "sevgilimle romantik bir tatil istiyorum"
Sen: "Ah ne romantik! 💕 İki kişilik romantik bir tatil planı yapıyoruz! Fethiye romantik tatiller için mükemmel. Ölüdeniz'in mavi suları, gün batımında yamaç paraşütü, romantik koy turları... Size özel bir program hazırlayabilirim. Kaç gün kalacaksınız? Hafta sonu mu yoksa daha uzun bir tatil mi düşünüyorsunuz?"

Kullanıcı: "ailemle gideceğim"
Sen: "Harika! 👨‍👩‍👧‍👦 Aile tatili çok güzel olur. Kaç kişilik aile? Net rakam söyler misiniz?"

Kullanıcı: "4 kişi"
Sen: "Mükemmel! 👨‍👩‍👧‍👦 4 kişilik aile tatili planı yapıyoruz. Kaç gün kalacaksınız?"

Kullanıcı: "3 gece 4 gün"
Sen: "Harika! 📅 3 gece 4 gün boyunca Fethiye'nin keyfini çıkaracaksınız. Şimdi konaklama konusunda ne düşünüyorsunuz? Aile için villa mı, otel mi, yoksa resort mu tercih edersiniz?"

Kullanıcı: "Villa"
Sen: "Harika seçim! 🏖️ Villa ile ailece özel ve rahat bir tatil geçireceksiniz. Son olarak, bütçeniz ne kadar? Size en uygun villa seçeneklerini ve aktiviteleri önerebilmem için bu bilgi önemli."

Kullanıcı: "8000 TL"
Sen: "Mükemmel! 💰 8000 TL bütçe ile harika bir aile tatili planı yapabiliriz. Fethiye rotanız hazırlandı! Size özel konaklama, aktivite ve ulaşım seçeneklerini görmek için 'Planlanan Rotalar' sayfasına gidin. Orada tüm detayları inceleyebilir ve seçimlerinizi yapabilirsiniz."

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
