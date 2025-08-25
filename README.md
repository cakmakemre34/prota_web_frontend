# 🌍 Prota Travel - Web Frontend

Modern ve responsive web arayüzü ile seyahat planlamanın en kolay yolu.

## 🎯 Özellikler

- 📱 **Mobile-First Design**: Telefondan kullanım için optimize edilmiş
- 🎨 **Modern UI/UX**: Gradient tasarımlar ve smooth animasyonlar
- 🔐 **Güvenli Kimlik Doğrulama**: JWT tabanlı auth sistemi
- 🚀 **Hızlı ve Responsive**: TypeScript + Styled Components
- 🌐 **Backend Entegrasyonu**: REST API ile tam entegrasyon

## 🛠️ Teknolojiler

- **React 19** + TypeScript
- **Styled Components** - CSS-in-JS styling
- **React Router** - SPA routing
- **Axios** - HTTP client
- **JWT** - Authentication

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Environment Değişkenleri
`.env` dosyası oluşturun:
```env
REACT_APP_API_URL=http://localhost:5050
REACT_APP_ENV=development
```

### 3. Backend'i Başlatın
```bash
# Backend klasöründe
cd ../off_backend/prota_backend
npm run dev
```

### 4. Web Uygulamasını Başlatın
```bash
npm start
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 📱 Ekran Görünümleri

### 🏠 Ana Sayfa
- Hero section (arama kutusu ile)
- Popüler destinasyonlar
- Önerilen rotalar
- İstatistikler

### 🔐 Kimlik Doğrulama
- Giriş yapma modalı
- Kayıt olma modalı
- Google OAuth desteği

### 📱 Mobile Responsive
- Hamburger menü
- Touch-friendly butonlar
- Swipe desteği
- Optimal mobile deneyim

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: #6366f1 (İndigo)
- **Secondary**: #f59e0b (Amber)
- **Success**: #10b981 (Emerald)
- **Error**: #ef4444 (Red)

### Breakpoints
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

### Bileşenler
- `Button` - Çeşitli varyantlar (primary, outline, ghost)
- `Input` - Form input'ları (validation ile)
- `Card` - İçerik kartları
- `Modal` - Overlay modalları

## 🔗 Backend Entegrasyonu

### API Endpoints
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/google` - Google OAuth

### Auth State Management
- Token localStorage'da saklanır
- Otomatik token refresh
- 401 durumunda otomatik logout

## 📦 Klasör Yapısı

```
src/
├── components/           # React bileşenleri
│   ├── Auth/            # Kimlik doğrulama
│   ├── Home/            # Ana sayfa bileşenleri
│   ├── Layout/          # Header, Footer
│   ├── Routes/          # Rota bileşenleri
│   └── UI/              # Genel UI bileşenleri
├── pages/               # Sayfa bileşenleri
├── services/            # API servisleri
├── styles/              # Global stiller
└── types/               # TypeScript türleri
```

## 🌐 Production Hazırlığı

### Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENV=production
```

### Deployment
- Netlify, Vercel veya herhangi bir static hosting
- `build/` klasörünü deploy edin

## 🔧 Geliştirme

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

## 📱 Mobile Optimizasyon

- Touch-friendly 44px minimum tap targets
- Viewport meta tag
- Mobile-first CSS approach
- Gesture support
- Fast loading times

## 🐛 Bilinen Problemler

- Google OAuth henüz production'da test edilmedi
- PWA özellikleri eklenmedi
- Offline support henüz yok

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'i push edin
5. Pull Request oluşturun

## 📄 Lisans

MIT Lisansı altında lisanslanmıştır.

---

**Not**: Bu proje mobile-first yaklaşım ile tasarlanmıştır. En iyi deneyim için mobil cihazlardan test edin.