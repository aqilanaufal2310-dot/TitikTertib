# TitikTertib

TitikTertib adalah aplikasi web pelaporan dan pemetaan parkir liar berbasis React, Vite, Tailwind CSS, dan Base44.

## Fitur

- Login dan register pengguna
- Pelaporan lokasi parkir liar
- Pemetaan laporan berbasis map
- Detail laporan
- Heatmap titik laporan
- Dashboard admin
- Verifikasi dan analisis laporan

## Teknologi

- React
- Vite
- Tailwind CSS
- Base44
- React Router
- TanStack Query

## Cara Menjalankan Project

1. Clone atau download repository ini dari GitHub:

   ```bash
   git clone https://github.com/aqilanaufal2310-dot/TitikTertib.git
   ```

2. Buka folder `TitikTertib` di VS Code.

   Pastikan terminal VS Code berada di dalam folder project yang berisi file `package.json`.

3. Install dependency:

   ```bash
   npm install
   ```

   Jika PowerShell memblokir `npm`, gunakan:

   ```bash
   npm.cmd install
   ```

4. Buat file `.env.local`.

   Project ini sudah menyediakan file `.env.example` sebagai contoh konfigurasi. Agar aplikasi bisa berjalan lokal, copy isi `.env.example` ke file baru bernama `.env.local`.

   Cara cepat lewat terminal Windows PowerShell:

   ```bash
   copy .env.example .env.local
   ```

   Atau bisa dibuat manual di VS Code:
   - klik kanan file `.env.example`
   - copy/duplicate file tersebut
   - ubah nama hasil copy menjadi `.env.local`

5. Jalankan project:

   ```bash
   npm run dev
   ```

   Jika PowerShell memblokir `npm`, gunakan:

   ```bash
   npm.cmd run dev
   ```

6. Setelah server berjalan, buka browser dan akses:

   ```txt
   http://localhost:5173
   ```

   Jika port 5173 tidak terbuka, coba:

   ```txt
   http://localhost:5174
   ```

Catatan: Project ini menggunakan konfigurasi Vite dengan log minimal, sehingga link localhost mungkin tidak muncul di terminal. Buka `http://localhost:5173` secara manual di browser.
