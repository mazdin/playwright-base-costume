# AT_WEB_SAUCEDEMO — Playwright OOP Framework

Automation testing untuk [SauceDemo](https://www.saucedemo.com) berbasis Playwright + TypeScript dengan pattern **Page Object Model (POM)** dan **Dependency Injection**.

---

## Tech Stack

| Tool | Versi |
|------|-------|
| Node.js | v20.x |
| Playwright | ^1.45 |
| TypeScript | ^6.0 |
| ESLint + eslint-plugin-playwright | ^10 / ^2 |
| Allure | ^3.4 |

---

## Struktur Folder

```
AT_WEB_SAUCEDEMO_1/
├── src/
│   ├── base/                        # Core framework (generik, app-agnostic)
│   │   ├── base-page.ts             # Abstract class: aksi, assertion, navigasi
│   │   ├── base-scenario.ts         # Interface shouldHave()
│   │   ├── base-url.ts              # Abstract class URL
│   │   ├── base-configs.ts          # Abstract class konfigurasi
│   │   ├── constants/Keyboard.ts    # Enum keyboard keys
│   │   └── objects/Element.ts       # Element validation class
│   │
│   ├── configs/app/
│   │   ├── app-urls.ts              # URL mapping aplikasi
│   │   └── app-configs.ts           # Konfigurasi aplikasi
│   │
│   ├── data/                        # Test data terpusat
│   │   ├── users.ts                 # Kredensial user SauceDemo
│   │   ├── products.ts              # Nama produk & ekspektasi sorting
│   │   └── checkout-data.ts         # Data form checkout & tax rate
│   │
│   └── modules/app/
│       ├── base/base-app-page.ts    # Base page spesifik aplikasi
│       ├── app-pages.ts             # Type definitions semua pages
│       └── pages/                   # login / inventory / product / cart / checkout
│           └── <fitur>/
│               ├── <fitur>.locator.ts
│               ├── <fitur>.page.ts
│               └── <fitur>.scenario.ts
│
├── tests/
│   ├── auth.setup.ts                # Login sekali → simpan session ke .auth/user.json
│   └── app/
│       ├── injection.ts             # Dependency injection (fixtures)
│       └── <fitur>/<fitur>.spec.ts  # login / inventory / product / cart / checkout / security
│
├── docs/                            # Dokumen test suite (xlsx)
├── .github/workflows/playwright.yml # CI: typecheck → lint → test
├── .env-example                     # Template environment variables
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json                    # Termasuk path aliases (@base, @data, dst)
```

### Path Aliases

Import memakai alias, bukan relative path dalam:

| Alias | Folder |
|-------|--------|
| `@base/*` | `src/base/*` |
| `@configs/*` | `src/configs/*` |
| `@modules/*` | `src/modules/*` |
| `@data/*` | `src/data/*` |

### Autentikasi (storageState)

Project `setup` ([tests/auth.setup.ts](tests/auth.setup.ts)) login sekali via UI lalu menyimpan session ke `.auth/user.json`. Semua spec lain mulai dalam keadaan **sudah login** — tidak perlu login per test. Spec yang butuh state tanpa login (login, security) memakai:

```typescript
test.use({ storageState: NO_AUTH_STATE });
```

---

## Setup

```bash
npm install
npx playwright install chromium
cp .env-example .env   # lalu sesuaikan bila perlu
```

## Menjalankan Test

```bash
npm test                              # semua test
npx playwright test tests/app/login/  # satu fitur
npm run test:headed                   # buka browser
npm run test:ui                       # UI mode
npm run typecheck                     # cek tipe TypeScript
npm run lint                          # ESLint
```

## Report

```bash
npm run report          # Playwright HTML report
npm run allure:serve    # Allure report
```

---

## Cara Menambahkan Module Baru

### Step 1 — Buat locator

```typescript
// src/modules/app/pages/namaPage/namaPage.locator.ts
export default class NamaPageLocator {
    static buttonSave: string = '#btn-save';
    static inputName: string = '#name';
}
```

### Step 2 — Buat scenario (interface)

```typescript
// src/modules/app/pages/namaPage/namaPage.scenario.ts
import BaseScenario from "@base/base-scenario";

export default interface NamaPageScenario extends BaseScenario {
    performSave(): Promise<void>;
}
```

### Step 3 — Buat page

```typescript
// src/modules/app/pages/namaPage/namaPage.page.ts
import BaseAppPage from "@modules/app/base/base-app-page";
import NamaPageLocator from "./namaPage.locator";
import NamaPageScenario from "./namaPage.scenario";
import Element from "@base/objects/Element";

export default class NamaPage extends BaseAppPage implements NamaPageScenario {
    pageUrl = (): string => this.urls.get.namaPage.url;

    shouldHave(): Element[] {
        return [
            Element.ofButton("Simpan"),
            Element.ofSelector(NamaPageLocator.inputName),
        ];
    }

    async performSave(): Promise<void> {
        await this.click(NamaPageLocator.buttonSave);
    }
}
```

### Step 4 — Daftarkan di app-pages.ts dan injection.ts

```typescript
// src/modules/app/app-pages.ts
export type AppPages = {
    loginPage: LoginPage;
    namaPage: NamaPage;   // tambahkan ini
};

// tests/app/injection.ts
export const test = base.extend<AppPages>({
    namaPage: async ({ page }, use) => await use(new NamaPage(page)),
});
```

### Step 5 — Tulis test spec

```typescript
// tests/app/namaPage/namaPage.spec.ts
import { test } from "../injection";

test.describe("Nama Page Feature", () => {
    test("TC-NAMAPAGE-001 | Verify page elements", async ({ namaPage }) => {
        await namaPage.navigateHere();
    });
});
```

> Test data (kredensial, nama produk, data form) jangan di-hardcode di page object atau spec — letakkan di `src/data/`.

---

## Element Validation Methods

| Method | Kegunaan |
|--------|----------|
| `Element.ofText("teks")` | Cek teks tampil di halaman |
| `Element.ofSelector("#id")` | Cek element visible |
| `Element.of("#input", "value")` | Cek input memiliki value |
| `Element.ofButton("Simpan")` | Cek button enabled |
| `Element.ofButton("Simpan", false)` | Cek button disabled |
| `Element.ofInput("#input", "")` | Cek input visible |
