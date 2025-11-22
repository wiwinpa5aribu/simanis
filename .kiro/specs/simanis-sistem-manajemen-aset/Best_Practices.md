Berikut adalah Hukum dan Aturan Universal untuk struktur folder frontend berbasis fitur (Feature-Driven):
1. Prinsip Pengorganisasian (Organization)
 * Hukum Kolokasi (The Principle of Colocation)
   * Aturan: "Hal-hal yang berubah bersamaan, harus ditempatkan berdekatan."
   * Penerapan: Jangan menaruh style, test, atau api jauh dari komponen yang menggunakannya. Jika Anda menghapus sebuah komponen fitur, folder test dan apinya harus ikut terhapus dalam satu folder yang sama.
   * Dampak: Mempercepat navigasi dan refactoring.
 * Prinsip LIFT
   * Aturan: Struktur folder harus memenuhi 4 kriteria:
     * Locating: Mudah menemukan kode.
     * Identifying: Sekali lihat nama file, tahu isinya apa.
     * Flat: Pertahankan struktur sedatar mungkin, jangan terlalu dalam (nested).
     * Try to be DRY: Jangan mengulang struktur yang membingungkan.
2. Aturan Ketergantungan (Dependencies & Boundaries)
 * Hukum Batas Fitur (The Feature Boundary Law)
   * Aturan: Fitur A dilarang keras mengimpor file internal dari Fitur B secara langsung (misal: import X from 'features/B/components/Child').
   * Solusi: Fitur A hanya boleh mengimpor apa yang diekspos melalui index.ts (Public API) milik Fitur B.
   * Dampak: Mencegah spaghetti code dan ketergantungan silang yang rumit.
 * Hukum Arus Satu Arah (Unidirectional Data Flow)
   * Aturan: Data dan dependensi harus mengalir dari "Global" -> "Feature" -> "UI Component".
   * Penerapan:
     * Folder pages boleh mengimpor features.
     * Folder features boleh mengimpor components (UI Kit global) dan hooks global.
     * Folder components (UI Kit global) TIDAK BOLEH mengimpor features atau pages. Dia harus "buta" terhadap bisnis aplikasi.
3. Aturan Komponen (Component Logic)
 * Pemisahan Smart vs Dumb (Container vs Presentational)
   * Aturan: Pisahkan komponen yang memikirkan "Bagaimana data didapat" (Smart) dengan komponen yang memikirkan "Bagaimana data ditampilkan" (Dumb).
   * Penerapan:
     * Dumb: Menerima data lewat props. Tidak ada logic fetch API. Lokasi: src/components/ui.
     * Smart: Melakukan fetch API, mengolah data, lalu mengopernya ke Dumb component. Lokasi: src/features/X/components.
 * Hukum Kepemilikan Tunggal (Single Ownership)
   * Aturan: Jika sebuah komponen hanya digunakan oleh satu fitur, maka komponen itu milik fitur tersebut. Jangan taruh di folder global.
   * Kapan pindah ke Global? Hanya ketika komponen tersebut digunakan oleh minimal dua fitur yang berbeda.
4. Aturan Kebersihan Kode (Hygiene)
 * Aturan Barrel File (index.ts)
   * Aturan: Setiap folder fitur wajib memiliki index.ts di akarnya.
   * Fungsi: Bertindak sebagai "Satpam/Resepsionis". Ia menentukan mana modul yang bersifat Public (bisa dipakai fitur lain) dan mana yang Private (rahasia dapur fitur tersebut).
 * Prinsip Slice before Share
   * Aturan: Jangan terburu-buru membuat kode menjadi "Reusable/Global".
   * Penerapan: Lebih baik menduplikasi sedikit kode di dua fitur berbeda (WET - Write Everything Twice) daripada memaksakan abstraksi global yang terlalu dini dan salah (premature abstraction), yang akhirnya malah membuat bug sulit dilacak.
Ringkasan Visual Alur Debugging
Jika Anda mengikuti hukum di atas, proses debugging akan selalu mengikuti pola ini:
 * Identifikasi Masalah: "Halaman Profil error".
 * Lokasi: Masuk ke src/features/profile.
 * Cek Boundaries: Apakah input dari index.ts benar?
 * Cek Smart Component: Apakah API call di api/ atau logic di hooks/ benar?
 * Cek Dumb Component: Apakah UI di components/ merender props dengan benar?



 tech stack yang perlu di install : TanStack Query, Zod , Eslint .



 ### 1\. Prinsip Utama: Logic & Scripting (`.ts`, `.tsx`, `.js`)

*Fokus: Keamanan Tipe & Immutability*

#### A. "The Strict Rule" (Hukum Ketat)

Jangan pernah membiarkan TypeScript longgar.

  * **Aturan:** `noImplicitAny` harus selalu aktif. Jangan gunakan tipe `any`. Jika Anda tidak tahu tipenya, gunakan `unknown` lalu lakukan pengecekan (*narrowing*).
  * **Mengapa:** `any` mematikan fitur keamanan TypeScript. 80% *bug* di masa depan berasal dari data yang tidak sesuai tipe yang diharapkan.

#### B. Immutability (Kekekalan Data)

Jangan pernah mengubah (*mutate*) data secara langsung. Selalu buat salinan baru.

  * **Salah:** `user.name = "Budi"`
  * **Benar:** `const updatedUser = { ...user, name: "Budi" }`
  * **Mengapa:** React mendeteksi perubahan UI berdasarkan perubahan referensi memori (*shallow compare*). Mutasi langsung seringkali membuat UI tidak *update* (re-render) atau menyebabkan *bug* yang sangat sulit dilacak (race conditions).

#### C. Return Early Pattern (Pola Keluar Lebih Awal)

Hindari *nesting* (if di dalam if di dalam if) yang membuat kode berbentuk panah (`>`).

  * **Contoh Terbaik:**
    ```typescript
    // Hindari ini:
    if (user) {
      if (user.isActive) {
        return <Dashboard />;
      }
    }

    // Lakukan ini (Guard Clauses):
    if (!user) return <Login />;
    if (!user.isActive) return <InactiveAlert />;
    return <Dashboard />;
    ```

-----

### 2\. Prinsip Tampilan & Struktur (`.html`, `.tsx`, JSX)

*Fokus: Semantik & Aksesibilitas*

#### A. Semantik adalah Harga Mati

Jangan gunakan `<div>` untuk segala hal.

  * **Aturan:** Gunakan tag HTML sesuai fungsinya.
      * Tombol yang diklik? Gunakan `<button>`, bukan `<div onClick>`.
      * Navigasi? Gunakan `<nav>`.
      * Daftar? Gunakan `<ul>` dan `<li>`.
  * **Mengapa:** Ini vital untuk SEO dan Aksesibilitas (Screen Reader). Selain itu, kode menjadi lebih mudah dibaca oleh developer lain karena strukturnya jelas.

#### B. Komponen Kecil & Fokus (Single Responsibility)

Satu file `.tsx` idealnya tidak lebih dari 200-300 baris.

  * **Aturan:** Jika sebuah komponen memiliki terlalu banyak `useState` atau `useEffect`, itu tanda komponen tersebut melakukan terlalu banyak hal. Pecah menjadi sub-komponen yang lebih kecil.

#### C. Hindari "Prop Drilling"

Jangan mengoper data melewati lebih dari 2 lapisan komponen secara manual (Kakek -\> Ayah -\> Anak -\> Cucu).

  * **Solusi:** Gunakan *Composition* (penerapan `children` prop) atau *Context API* untuk data global.

-----

### 3\. Prinsip Styling (`.css`)

*Fokus: Isolasi & Skalabilitas*

#### A. Mobile-First Approach

Selalu tulis CSS untuk tampilan layar kecil (mobile) terlebih dahulu, baru gunakan media query (`min-width`) untuk layar yang lebih besar.

  * **Mengapa:** Kode untuk mobile biasanya lebih sederhana. Pendekatan ini membuat browser merender lebih cepat di perangkat mobile dan mengurangi penulisan kode *override* yang berantakan.

#### B. Hindari Magic Values

Jangan menyebar nilai piksel atau warna hex acak di seluruh file CSS.

  * **Aturan:** Gunakan **CSS Variables** (Custom Properties) atau file konfigurasi tema.
    ```css
    /* Root variables */
    :root {
      --primary-color: #3498db;
      --spacing-md: 16px;
    }

    /* Usage */
    .card {
      padding: var(--spacing-md); /* Mudah diubah di satu tempat */
      color: var(--primary-color);
    }
    ```

-----

### 4\. Prinsip Data & Konfigurasi (`.json`)

*Fokus: Validasi Runtime*

#### A. Jangan Percaya JSON

JSON (terutama dari API) adalah "daerah liar". Anda tidak bisa menjamin isinya selalu sesuai harapan.

  * **Teknik Modern:** Gunakan pustaka validasi skema seperti **Zod** saat membaca file JSON atau respon API.
  * **Contoh Konsep:**
    ```typescript
    // Validasi bahwa JSON pasti punya id (string) dan price (number)
    const ProductSchema = z.object({
      id: z.string(),
      price: z.number()
    });
    // Jika JSON dari backend salah format, aplikasi akan melempar error spesifik,
    // bukan error "undefined is not an object" yang membingungkan.
    ```

-----

### 5\. Prinsip Dokumentasi & Kebersihan (General)

#### A. Komentar "Mengapa", Bukan "Apa"

Kode yang baik sudah menjelaskan "apa" yang dia lakukan. Komentar hanya diperlukan untuk menjelaskan **mengapa** keputusan aneh itu diambil.

  * **Buruk:** `// Fungsi untuk menambah angka (Jelas dari nama fungsi)`
  * **Baik:** `// Kita menambah +1 di sini karena API backend menghitung indeks mulai dari 1, bukan 0.`

#### B. Naming Convention (Penamaan)

Ini adalah bagian tersulit namun terpenting.

  * **Boolean:** Selalu awali dengan `is`, `has`, atau `should`. (Contoh: `isLoading`, `hasError`, `shouldRender`).
  * **Event Handler:** Awali dengan `handle`. (Contoh: `handleSubmit`, `handleInputChange`).
  * **Props:** Awali dengan `on` untuk event. (Contoh: `<Button onClick={handleClick} />`).

-----

### Tabel Ringkasan untuk Pedoman Anda

| Aspek | Format File | Aturan Emas (*Golden Rule*) | Keuntungan Masa Depan |
| :--- | :--- | :--- | :--- |
| **Logika** | `.ts`, `.tsx` | **Strict Type Safety** & **Immutability** | Mencegah 80% runtime error dan bug state. |
| **Tampilan** | `.html`, `.tsx` | **Semantic HTML** & **Component Composition** | Kode mudah dipahami strukturnya & aksesibel. |
| **Gaya** | `.css` | **Scoped CSS** & **CSS Variables** | Mengubah tema warna aplikasi hanya butuh 1 menit. |
| **Data** | `.json` | **Runtime Validation (Zod)** | Error handling yang jelas saat data API korup. |
