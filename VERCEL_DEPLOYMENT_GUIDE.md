# Panduan Integrasi & Deployment: Vercel + PostgreSQL + Google Drive API

Dokumen ini berisi panduan langkah-demi-langkah (*step-by-step*) untuk mengonfigurasi **Google Cloud Service Account**, membagikan folder **Google Drive**, menyiapkan **PostgreSQL (Neon / Supabase)**, dan men-deploy project **ibraschedule_v2** ke **Vercel**.

---

## 1. Setup Service Account di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/) dan buat project baru (atau pilih project yang sudah ada).
2. **Aktifkan Google Drive API**:
   - Ke menu **APIs & Services** > **Library**.
   - Cari **Google Drive API**, klik **Enable**.
3. **Buat Service Account**:
   - Ke menu **IAM & Admin** > **Service Accounts**.
   - Klik **+ Create Service Account**.
   - Beri nama (misal: `ibraschedule-storage`), lalu klik **Create and Continue** dan **Done**.
4. **Unduh JSON Key Credentials**:
   - Klik Service Account yang baru saja dibuat.
   - Buka tab **Keys** > klik **Add Key** > **Create new key**.
   - Pilih format **JSON**, lalu klik **Create**. File JSON kredensial akan terunduh otomatis.
5. **Ekstrak Kredensial untuk Environment Variables**:
   - Buka file JSON yang telah diunduh, catat 2 variabel kunci:
     - `client_email`: Email Service Account (contoh: `ibraschedule-storage@project-id.iam.gserviceaccount.com`).
     - `private_key`: Kunci privat berformat `-----BEGIN PRIVATE KEY-----\n...`.

---

## 2. Setup Folder Google Drive & Hak Akses

1. Buka [Google Drive](https://drive.google.com/).
2. Buat folder baru (misal: `SecondBrain_Uploads`).
3. Dapatkan **Folder ID**:
   - Buka folder tersebut di browser.
   - Salin ID dari URL browser: `https://drive.google.com/drive/folders/`**`1A2B3C4D5E6F7G8H9I0J`**
   - Karakter setelah `/folders/` adalah `GOOGLE_DRIVE_FOLDER_ID` Anda.
4. **Bagi Hak Akses ke Service Account**:
   - Klik tombol **Share (Bagikan)** pada folder tersebut.
   - Tempel email Service Account (`client_email` dari langkah 1).
   - Pastikan role diset sebagai **Editor** agar Service Account dapat mengunggah file.
   - Hilangkan centang *Notify people*, lalu klik **Share**.

---

## 3. Setup PostgreSQL Database (Neon / Supabase / Vercel Postgres)

1. Buat database PostgreSQL gratis di [Neon.tech](https://neon.tech) atau [Supabase.com](https://supabase.com).
2. Salin **Database Connection String** (`DATABASE_URL`), pastikan menyertakan `sslmode=require` (contoh: `postgresql://user:pass@ep-pooler.neon.tech/neondb?sslmode=require`).
3. Jalankan perintah migrasi skema tabel dari terminal lokal:
   ```bash
   npx prisma db push
   ```
   Perintah ini akan membuat tabel `files_metadata`, `user_profiles`, `courses`, `tasks`, `notes`, dan `schedule_events` secara otomatis di database PostgreSQL Anda.

---

## 4. Konfigurasi Environment Variables & Deploy ke Vercel

1. Buat file `.env` lokal berdasarkan file [.env.example](file:///Users/ibra/Documents/WEB/ibraschedule_v2/.env.example):
   ```env
   DATABASE_URL="postgresql://user:pass@ep-pooler.neon.tech/neondb?sslmode=require"
   GOOGLE_CLIENT_EMAIL="service-account-email@project.iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
   GOOGLE_DRIVE_FOLDER_ID="1A2B3C4D5E6F7G8H9I0J"
   ```

2. **Push Project ke Git (GitHub / GitLab)**.
3. **Import Project di Vercel**:
   - Masuk ke [Vercel Dashboard](https://vercel.com/dashboard) > **Add New** > **Project**.
   - Import repositori `ibraschedule_v2`.
   - Framework Preset: **Vite**.
4. **Isi Environment Variables di Vercel**:
   - Ke bagian **Environment Variables** di Vercel:
     - `DATABASE_URL`
     - `GOOGLE_CLIENT_EMAIL`
     - `GOOGLE_PRIVATE_KEY` (Pastikan karakter `\n` tetap dipertahankan)
     - `GOOGLE_DRIVE_FOLDER_ID`
5. Klik **Deploy**!

---

## 5. Pengujian & Verifikasi Endpoint API Serverless

Setelah deployment selesai di Vercel:
- **Health Check Endpoint**: Akses `https://your-domain.vercel.app/api/health` untuk memverifikasi koneksi PostgreSQL dan autentikasi Google Drive API secara live.
- **Upload File**: Uji coba unggah berkas melalui UI Catatan. Berkas akan terunggah ke Google Drive dan metadatanya tersimpan di PostgreSQL.
