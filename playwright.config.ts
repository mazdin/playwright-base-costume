import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : 3,
    reporter: [
        ["html", { outputFolder: "playwright-report", open: "never" }],
        ["allure-playwright", {
            outputFolder: "allure-results",
            detail: true,
            suiteTitle: false,
        }],
        ["junit", { outputFile: "junit-report/results.xml" }],
    ],
    use: {
        screenshot: isCI ? "off" : "only-on-failure",
        video: "off",
        trace: isCI ? "retain-on-failure" : "on",
        headless: process.env.PLAYWRIGHT_HEADLESS
            ? process.env.PLAYWRIGHT_HEADLESS.toLowerCase() === "true"
            : !!process.env.CI,
        storageState: process.env.STORAGE_STATE ? process.env.STORAGE_STATE : undefined,
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                browserName: "chromium",
                channel: process.env.CI ? undefined : "chrome",
            } as any,
        },
    ],
});
