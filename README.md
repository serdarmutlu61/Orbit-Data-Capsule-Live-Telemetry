# Orbit Data Capsule – Live Telemetry

Kapsülün yakın Dünya yörüngesinde topladığı telemetri verilerini gerçek zamanlı izlemek için hazırlanmış modern, koyu temalı bir web arayüzü.

## Özellikler
- Gerçek zamanlı veri akışı (simülasyon; 2 sn aralıklarla)
- Dashboard bileşenleri:
  - Radyasyon seviyesi → Gauge (ölçer)
  - Sıcaklık seviyesi → Line chart (canlı + 24 saat geçmiş)
  - Veri depolama seviyesi → Donut (daire bar)
  - Yörünge dolanım hızı → Sayısal/analog bar + 24 saat geçmiş
- Kapsül durumu: Online/Offline, UTC zaman damgası, kapsül kimliği, “Telemetry stable/unstable” uyarısı
- JSON payload’lar konsola loglanır
- Teknolojiler: React, Vite, TypeScript, TailwindCSS, Recharts, Framer Motion, Dayjs (utc)

## Kurulum
1) Node.js LTS kurulu olsun. Windows için:
```powershell
winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
```
2) Bağımlılıkları yükleyin:
```powershell
cd "C:\Users\ALP ARSLAN\Desktop\sirius\orbit-telemetry"
npm install
```
3) PowerShell script engeli varsa oturum bazlı kaldırın:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```
4) Geliştirme sunucusu:
```powershell
npm run dev
```
Tarayıcıda `http://localhost:5173` adresini açın.

## Proje Yapısı
```
orbit-telemetry/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  src/
    main.tsx
    index.css
    modules/
      app/App.tsx
      dashboard/TelemetryDashboard.tsx
      dashboard/widgets/
        Gauge.tsx
        Donut.tsx
        Speed.tsx
    state/
      useTelemetry.ts
```

## Simülasyon
`src/state/useTelemetry.ts` her 2 saniyede bir yeni örnek üretir ve JSON’u konsola loglar. 24 saatlik geçmiş, dakikalık örneklerle tutulur.

## Gerçek Veri Kaynağına Geçiş
WebSocket/MQTT için `setInterval` yerine soket olaylarında `setLatest(next)` çağırın; dakikalık örnekleri 24 saatlik tamponda tutmaya devam edin.

## Sorun Giderme
- Boş ekran: tarayıcı konsolunu kontrol edin. Dayjs UTC eklentisi projeye dahil edilmiştir (`TelemetryDashboard.tsx`).
- Port çakışması: `npm run dev -- --port=5174`
- Ağda yayın: `npm run dev -- --host`

Lisans: Demo/örnek amaçlı.
