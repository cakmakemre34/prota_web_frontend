# 🚀 Prota Travel - ChatGPT API Entegrasyonu

Bu proje, seyahat planlaması için ChatGPT API entegrasyonu ile geliştirilmiş modern bir web uygulamasıdır.

## ✨ Özellikler

- 🤖 **Gerçek ChatGPT Entegrasyonu** - OpenAI API ile canlı sohbet
- 🎯 **Seyahat Asistanı** - Kişiselleştirilmiş seyahat önerileri
- 🏨 **İşletme Detayları** - Otel, restoran, aktivite ve ulaşım bilgileri
- 📱 **Responsive Tasarım** - Tüm cihazlarda mükemmel deneyim
- 🎨 **Modern UI/UX** - Styled Components ile şık arayüz

## 🛠️ Kurulum

### 1. **Frontend Kurulum**

```bash
# Proje klasörüne git
cd prota_web_front

# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npm start
```

### 2. **Backend Kurulum**

```bash
# Server klasörüne git
cd server

# Bağımlılıkları kur
npm install

# .env dosyası oluştur
cp .env.example .env
```

### 3. **API Key Kurulumu**

1. **OpenAI API Key Al:**
   - [OpenAI Platform](https://platform.openai.com/api-keys) adresine git
   - Yeni API key oluştur
   - API key'i kopyala (`sk-` ile başlayan)

2. **Environment Variables Ayarla:**
   ```bash
   # server/.env dosyasını düzenle
   OPENAI_API_KEY=sk-your-actual-api-key-here
   PORT=5000
   NODE_ENV=development
   ```

### 4. **Backend Sunucusunu Başlat**

```bash
# Development modunda çalıştır
npm run dev

# Production modunda çalıştır
npm start
```

## 🔧 Teknik Detaylar

### **Frontend (React + TypeScript)**
- **ChatboxModal**: ChatGPT API entegrasyonu
- **BusinessDetailsModal**: İşletme detayları ve fotoğraf carousel
- **Styled Components**: Modern CSS-in-JS yaklaşımı
- **Responsive Design**: Mobile-first tasarım

### **Backend (Node.js + Express)**
- **OpenAI Integration**: GPT-3.5-turbo modeli
- **Conversation Context**: Sohbet geçmişi desteği
- **Error Handling**: Kapsamlı hata yönetimi
- **Security**: CORS ve input validation

### **API Endpoints**
- `POST /api/chat` - ChatGPT sohbet endpoint'i
- `GET /api/health` - Sunucu durumu kontrolü

## 🚀 Kullanım

### **Ana Ekran**
1. "Nereye gitmek istersin" kısmına yazı yaz
2. "Keşfet" butonuna tıkla
3. Chatbox modal'ı açılır
4. ChatGPT ile gerçek zamanlı sohbet

### **İşletme Detayları**
1. Sol panelde "Detayları Görüntüle" butonuna tıkla
2. Modal açılır
3. Fotoğraf carousel ile gezin
4. Tab'lar arasında geçiş yap

## 🔒 Güvenlik

- API key'ler `.env` dosyasında saklanır
- `.env` dosyası `.gitignore`'da bulunur
- CORS koruması aktif
- Input validation mevcut

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🎨 Renk Paleti

- **Primary**: `#8b9cf6` (Açık mavi-mor)
- **Primary Dark**: `#7c3aed` (Koyu mor)
- **Gradient**: `linear-gradient(90deg, #8b9cf6 0%, #a78bfa 100%)`

## 🐛 Sorun Giderme

### **API Key Hatası**
```bash
Error: invalid_api_key
```
**Çözüm:** `.env` dosyasında API key'in doğru olduğundan emin ol

### **CORS Hatası**
```bash
Access to fetch at 'http://localhost:5000/api/chat' from origin 'http://localhost:3000' has been blocked
```
**Çözüm:** Backend sunucusunun çalıştığından emin ol

### **Port Çakışması**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Çözüm:** `.env` dosyasında farklı port kullan (örn: `PORT=5001`)

## 📝 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request oluştur

## 📞 İletişim

- **Proje Linki**: [GitHub Repository]
- **Sorunlar**: [Issues](link-to-issues)

---

**Not:** Bu proje eğitim amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik önlemleri alınmalıdır.