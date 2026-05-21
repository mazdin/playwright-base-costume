# AT_TEMPLATE — Playwright OOP Framework

Template automation testing berbasis Playwright + TypeScript dengan pattern **Page Object Model (POM)** dan **Dependency Injection**.

---

## Tech Stack

| Tool | Versi |
|------|-------|
| Node.js | v20.x |
| Playwright | ^1.45.2 |
| TypeScript | via @types/node |
| MySQL2 | ^3.15.3 |
| Allure | ^3.4.4 |

---

## Struktur Folder

```
AT_TEMPLATE/
├── src/
│   ├── base/                        # Core framework — JANGAN diubah
│   │   ├── base-page.ts             # Abstract class utama dengan semua method Playwright
│   │   ├── base-locator.ts          # Base class untuk semua locator
│   │   ├── base-scenario.ts         # Interface shouldHave()
│   │   ├── base-url.ts              # Abstract class URL
│   │   ├── base-configs.ts          # Abstract class konfigurasi
│   │   ├── extentions.ts            # String extensions
│   │   ├── constants/
│   │   │   └── Keyboard.ts          # Enum keyboard keys
│   │   ├── objects/
│   │   │   └── Element.ts           # Element validation class
│   │   └── utils/
│   │       ├── helper.ts            # Utility functions
│   │       ├── logger.ts            # Logger
│   │       └── DateHelper.ts        # Date utilities
│   │
│   ├── configs/
│   │   └── app/
│   │       ├── app-urls.ts          # URL mapping aplikasi
│   │       └── app-configs.ts       # Konfigurasi aplikasi
│   │
│   └── modules/
│       └── app/                     # Ganti "app" dengan nama modul Anda
│           ├── base/
│           │   └── base-app-page.ts # Base page spesifik aplikasi
│           ├── app-pages.ts         # Type definitions semua pages
│           └── pages/
│               └── login/           # Contoh modul login
│                   ├── login.locator.ts
│                   ├── login.page.ts
│                   └── login.scenario.ts
│
├── tests/
│   └── app/
│       ├── injection.ts             # Dependency injection (fixtures)
│       └── loginTC/
│           └── login.spec.ts        # Contoh test spec
│
├── .env-example                     # Template environment variables
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

---

## Setup Project Baru

### 1. Clone / Copy template ini

```bash
cp -r AT_TEMPLATE nama-project-baru
cd nama-project-baru
```

### 2. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Setup environment variables

```bash
cp .env-example .env
# Edit .env sesuai environment Anda
```

### 4. Jalankan test

```bash
# Semua test
npx playwright test

# Test spesifik
npx playwright test tests/app/loginTC/

# Mode headed (buka browser)
npx playwright test --headed

# Dengan UI mode
npx playwright test --ui
```

### 5. Lihat report

```bash
# Playwright HTML report
npx playwright show-report

# Allure report
allure serve allure-results
```

---

## Cara Menambahkan Module Baru

### Step 1 — Buat locator

```typescript
// src/modules/app/pages/namaPage/namaPage.locator.ts
import BaseLocator from "../../../../base/base-locator";

export default class NamaPageLocator extends BaseLocator {
    static buttonSave: string = '#btn-save';
    static inputName: string = '#name';
}
```

### Step 2 — Buat scenario (interface)

```typescript
// src/modules/app/pages/namaPage/namaPage.scenario.ts
import BaseScenario from "../../../../base/base-scenario";

export default interface NamaPageScenario extends BaseScenario {
    performSave(): Promise<void>;
}
```

### Step 3 — Buat page

```typescript
// src/modules/app/pages/namaPage/namaPage.page.ts
import BaseAppPage from "../../base/base-app-page";
import NamaPageLocator from "./namaPage.locator";
import NamaPageScenario from "./namaPage.scenario";
import Element from "../../../../base/objects/Element";

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

### Step 4 — Daftarkan di app-pages.ts

```typescript
// src/modules/app/app-pages.ts
import NamaPage from "./pages/namaPage/namaPage.page";

export type AppPages = {
    loginPage: LoginPage;
    namaPage: NamaPage;   // tambahkan ini
};
```

### Step 5 — Daftarkan di injection.ts

```typescript
// tests/app/injection.ts
import NamaPage from "../../src/modules/app/pages/namaPage/namaPage.page";

export const test = base.extend<AppPages>({
    loginPage: async ({ page }, use) => await use(new LoginPage(page)),
    namaPage: async ({ page }, use) => await use(new NamaPage(page)),  // tambahkan ini
});
```

### Step 6 — Tulis test spec

```typescript
// tests/app/namaPageTC/namaPage.spec.ts
import { test } from "../injection";

test.describe("Nama Page Feature", () => {
    test("TC-NAMAPAGE-001 | Verify page elements", async ({ namaPage }) => {
        await namaPage.navigateHere();
    });
});
```

---

## Element Validation Methods

| Method | Kegunaan |
|--------|----------|
| `Element.ofText("teks")` | Cek teks tampil di halaman |
| `Element.ofSelector("#id")` | Cek element visible |
| `Element.of("#input", "value")` | Cek input memiliki value |
| `Element.ofButton("Simpan")` | Cek button enabled |
| `Element.ofButton("Simpan", false)` | Cek button disabled |
| `Element.ofInput("#input", "label")` | Cek input visible |

---

## Database (MySQL)

```typescript
// Gunakan method sqlExecute dari BasePage
const result = await this.sqlExecute(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    "SELECT * FROM users WHERE email = 'test@example.com'"
);
```
