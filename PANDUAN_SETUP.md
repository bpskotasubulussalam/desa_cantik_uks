# Panduan Setup — Dashboard dengan Sumber Data Google Sheet

File yang dihasilkan:
- **`index.html`** — satu-satunya halaman dashboard (sudah dimodifikasi agar data diambil dari Google Sheet)
- **`sheet-config.js`** — **wajib diisi** dengan ID Google Sheet Anda
- **`sheet-loader.js`** — mesin pengambil & pengolah data dari Sheet (tidak perlu diubah)
- **`default-data.js`** — data contoh/cadangan, otomatis dipakai jika Sheet belum tersambung
- **`Template_Data_BankSampah_IREKA.xlsx`** — template siap-upload ke Google Sheets, 10 tab sesuai kebutuhan dashboard, sudah diisi data yang sama seperti dashboard saat ini

Tidak ada halaman input terpisah lagi — staf kelurahan cukup edit **Google Sheet** langsung
(alat yang sudah mereka kenal), dan dashboard membaca perubahannya secara berkala.

## 1. Upload template ke Google Sheets
1. Buka https://drive.google.com → **New → File upload** → pilih `Template_Data_BankSampah_IREKA.xlsx`.
2. Setelah terupload, klik kanan file → **Open with → Google Sheets** (otomatis dikonversi
   menjadi Google Sheet, format .xlsx aslinya bisa dihapus/diabaikan).
3. Buka tab **PANDUAN** di dalam sheet tersebut — berisi instruksi singkat untuk staf yang
   akan mengedit data sehari-hari.

## 2. Bagikan Sheet sebagai publik-baca (wajib!)
1. Di Google Sheet, klik tombol **Share** (kanan atas).
2. Bagian **General access**, ubah dari "Restricted" menjadi **"Anyone with the link"**,
   peran **Viewer**.
3. Klik **Done**.
   > Ini membuat dashboard bisa *membaca* data secara publik. Siapa yang boleh *mengedit*
   > tetap diatur terpisah lewat daftar **People with access** (tambahkan email staf yang
   > berwenang mengedit sebagai **Editor**).

## 3. Ambil ID Sheet & isi `sheet-config.js`
URL Google Sheet Anda akan terlihat seperti:
```
https://docs.google.com/spreadsheets/d/1AbCdeFGhIJkLmNoPQRstuVWxyz/edit#gid=0
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ <- ini ID-nya
```
Salin bagian itu ke `sheet-config.js`:
```js
window.SHEET_CONFIG = {
  sheetId: "1AbCdeFGhIJkLmNoPQRstuVWxyz",
  refreshSeconds: 45
};
```

## 4. Deploy ke GitHub Pages (atau hosting statis lain)
1. Push `index.html`, `sheet-config.js`, `sheet-loader.js`, `default-data.js` ke repository.
2. Repo → **Settings → Pages** → pilih branch & folder root → **Save**.
3. Dashboard bisa diakses di `https://namauser.github.io/nama-repo/index.html`.

## Cara kerja "auto-update"
- Saat dibuka, dashboard mengambil data dari Sheet lewat endpoint publik Google
  (tidak butuh API key, tidak butuh backend sendiri).
- Dashboard lalu **mengecek ulang otomatis setiap 45 detik** (bisa diubah lewat
  `refreshSeconds` di `sheet-config.js`) — begitu ada perubahan tersimpan di Sheet,
  dashboard akan menampilkannya tanpa perlu di-reload manual oleh pengunjung.
- Ini **bukan realtime instan** seperti database khusus — ada jeda maksimal
  sebesar `refreshSeconds`. Untuk kebutuhan dashboard kelurahan, jeda puluhan detik
  ini biasanya cukup; kalau ingin lebih cepat, kecilkan `refreshSeconds` (jangan
  terlalu kecil, misal di bawah 15 detik, agar tidak terlalu sering memanggil Google Sheets).
- Jika Sheet gagal diakses (belum di-share publik, ID salah, dsb), dashboard otomatis
  jatuh ke `default-data.js` supaya halaman tetap tampil (tidak kosong/error).

## Tombol "✏️ Edit Data" di dashboard
Header dashboard sekarang punya tombol yang langsung membuka Google Sheet untuk diedit
(muncul otomatis begitu `sheet-config.js` terisi benar). Cocok untuk staf kelurahan yang
tidak perlu tahu soal kode — tinggal klik, edit, selesai.

## Struktur 10 tab di template
| Tab | Kolom | Dipakai untuk |
|---|---|---|
| KPI | Key, Value | Angka ringkasan atas + 2 teks paragraf |
| Tren | Tahun, Bulan, Nilai_kg | Grafik tren volume bulanan (total & rata-rata dihitung **otomatis**) |
| Komposisi | Kategori, Volume_kg, Warna | Grafik Pareto komposisi sampah |
| Nasabah_RT | RT, Jumlah | Grafik sebaran nasabah per RT |
| Valuasi | Komoditas, Volume_kg, Tarif_per_kg, Nilai_Rp, IsTotal | Tabel & grafik donat valuasi ekonomi |
| Difusi_RW | Nama_RW, Volume_kg, IsAsal | Kartu difusi ke RW lain (persentase dihitung **otomatis** relatif ke RW ber-`IsAsal=YA`) |
| Dampak | Icon, Judul, Deskripsi | 3 kartu dampak lingkungan/sosial |
| SWOT | Kategori (S/W/O/T), Poin | 4 kartu SWOT |
| Rekomendasi | Teks | Daftar rekomendasi strategis (bernomor otomatis) |
| Roadmap | Kapan, Judul, Deskripsi | 3 fase peta jalan |

Menambah baris baru di tab manapun = otomatis menambah item baru di dashboard (RW baru,
RT baru, kategori sampah baru, dst) — tidak perlu sentuh kode sama sekali.

## Catatan keamanan
Karena Sheet dibagikan sebagai "Anyone with the link", siapa pun yang tahu link-nya bisa
melihat isinya (bukan cuma dashboard). Untuk mencegah *pengeditan* oleh sembarang orang,
pastikan **General access tetap "Viewer"** (bukan "Editor"), dan berikan akses edit hanya
lewat **People with access** ke email staf yang berwenang.
