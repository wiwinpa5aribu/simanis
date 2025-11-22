TypeScript — tipe statis mencegah bug di level file/function.
ESLint (+ plugin untuk framework Anda) — static analysis & best-practice linting.
Prettier — konsistensi format file.
EditorConfig — sinkron aturan editor (tab/indent).
Husky + lint-staged — pre-commit hook: jalankan lint/format hanya di file yang diubah.
Commitlint (conventional commits) — commit message konsisten.
Jest / Vitest + Testing Library — unit test & component test per-file.
Cypress / Playwright — E2E tests untuk alur penting (peminjaman, scan, sync).
Storybook — dokumentasi & interactive sandbox untuk setiap UI component (satu file = satu story).
TypeDoc / JSDoc — dokumentasi API/komponen berbasis tipe.
OpenAPI / Swagger — contract untuk backend API sehingga frontend file mengacu pada schema yang kuat.
Renovate / Dependabot — dependency update otomatis.
SonarQube (OSS) / GitHub Code Scanning — quality gate, security & code smell detection.
Snyk / npm audit — vulnerability scanning.
Instalasi singkat (npm)
Contoh install inti:
npm install -D typescript eslint prettier husky lint-staged @commitlint/config-conventional @commitlint/cli
npm install -D vitest @testing-library/react jest cypress storybook typedoc
# libs runtime
npm install pouchdb idb @zxing/browser qrcode jspdf xlsx

Pola & aturan per-file (prinsip praktis)
Small & Single Responsibility — tiap file berisi 1 komponen / 1 module / 1 util.
Nama file konsisten — PascalCase untuk Komponen (AssetCard.tsx), camelCase untuk util (formatCurrency.ts).
Satu export default atau named export eksplisit — jangan campur keduanya di file yang sama.
Test file sebelah file implementasi — AssetCard.test.tsx di folder yang sama.
Story file — AssetCard.stories.tsx untuk dokumentasi visual.
Index (barrel) files minimal — gunakan hanya kalau mempermudah import, jangan buat barrel besar yang menyembunyikan dependensi.
Type first — definisikan interface/type di file sama atau types.ts kecil per domain.
Small functions, pure functions — mudah di-test.
Dokumentasi singkat header — 2–3 baris komentar di top-file menjelaskan tujuan file.
Batas ukuran file — target < 300–400 baris; jika lebih, pecah jadi subkomponen.


Skrip npm penting (package.json)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest --run",
    "storybook": "storybook dev -p 6006",
    "cypress:open": "cypress open"
  }
}

Pre-commit & commit rules (Husky + lint-staged + commitlint)
package.json:
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
},
"lint-staged": {
  "src/**/*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write",
    "git add"
  ]
}

CI minimal (GitHub Actions) — lint → typecheck → test → build
.github/workflows/ci.yml (potongan):
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with: node-version: 20
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:ci
      - run: pnpm build

Tambahkan quality gate: run Sonar/coverage upload, fail pipeline bila coverage turun di bawah threshold.
Contract & API hygiene (penting agar per-file frontend tidak brittle)
Gunakan OpenAPI untuk mendefinisikan semua endpoint; generate typed clients (openapi-generator / openapi-typescript).
 → Frontend file import types & client generated, bukan string URL manual.
Schema validation di client (Zod) sehingga setiap response divalidasi sebelum digunakan di file.
Dokumentasi & keputusan arsitektur
Storybook untuk UI component dokumentasi (sehingga setiap komponen punya contoh penggunaan & props docs).
TypeDoc untuk API & util; deploy auto-docs di GitHub Pages.
ADR (Architecture Decision Records): setiap keputusan arsitektur tersimpan — file doc/adr/ — agar developer baru memahami “mengapa” suatu file dibuat seperti itu.
Quality & safety tambahan
Coverage per-file: target minimal 60–80% untuk logic-critical files.
Mutation testing (Stryker) untuk memastikan tests bermakna.
Static security scan (Snyk / Dependabot) dan sesuaikan policy review.
Code owners (CODEOWNERS) untuk proteksi file sensitif (mis. server config, API client).
Observability / runtime feedback (mempermudah maintenance)
Sentry untuk error tracing; hubungkan stacktrace ke source maps build — memudahkan tracing file & baris yang error.
Feature flags (LaunchDarkly or open-source Unleash) untuk safe rollout per-module/feature.


