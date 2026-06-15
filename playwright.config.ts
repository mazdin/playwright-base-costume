import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const isCI = !!process.env.CI;

/** Session login standard_user, dibuat oleh tests/auth.setup.ts. */
export const STORAGE_STATE = path.join(__dirname, ".auth", "user.json");

const desktopChrome = {
    ...devices["Desktop Chrome"],
    channel: isCI ? undefined : "chrome",
};

/**
 * Cross-browser di-opt-in lewat env CROSS_BROWSER=true agar `npm test` default
 * tetap cepat (chromium saja). CI bisa mengaktifkan saat butuh matriks penuh.
 */
const crossBrowser = process.env.CROSS_BROWSER?.toLowerCase() === "true";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    workers: isCI ? 1 : 3,
    reporter: [
        ["html", { outputFolder: "playwright-report", open: "never" }],
        [
            "allure-playwright",
            {
                outputFolder: "allure-results",
                detail: true,
                suiteTitle: false,
            },
        ],
        ["junit", { outputFile: "junit-report/results.xml" }],
    ],
    use: {
        screenshot: "only-on-failure",
        video: "off",
        trace: isCI ? "retain-on-failure" : "on",
        headless: process.env.PLAYWRIGHT_HEADLESS ? process.env.PLAYWRIGHT_HEADLESS.toLowerCase() === "true" : isCI,
    },
    projects: [
        {
            name: "setup",
            testMatch: /auth\.setup\.ts/,
            use: desktopChrome,
        },
        {
            name: "chromium",
            dependencies: ["setup"],
            testIgnore: /auth\.setup\.ts/,
            use: {
                ...desktopChrome,
                storageState: STORAGE_STATE,
            },
        },
        // storageState dari setup bersifat browser-agnostic (JSON cookies/localStorage),
        // jadi bisa dipakai ulang lintas browser.
        ...(crossBrowser
            ? [
                  {
                      name: "firefox",
                      dependencies: ["setup"],
                      testIgnore: /auth\.setup\.ts/,
                      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
                  },
                  {
                      name: "webkit",
                      dependencies: ["setup"],
                      testIgnore: /auth\.setup\.ts/,
                      use: { ...devices["Desktop Safari"], storageState: STORAGE_STATE },
                  },
              ]
            : []),
    ],
});
