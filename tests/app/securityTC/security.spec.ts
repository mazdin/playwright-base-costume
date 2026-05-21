import { expect } from "@playwright/test";
import { test as appTest } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";

appTest.describe("Security Feature", () => {
    appTest("SEC-02 | Back Button setelah logout tidak bisa masuk kembali", async ({ loginPage, page }) => {
        await epic("SauceDemo");
        await feature("Security");
        await story("Back Button After Logout");
        await severity("critical");
        await description("Verifikasi user tidak bisa kembali ke halaman inventory setelah logout menggunakan tombol back browser.");
        await tag("security");

        await step("Login dengan kredensial valid", async () => {
            await loginPage.navigateHere();
            await loginPage.performLogin();
        });

        await step("Logout via burger menu", async () => {
            await page.click('#react-burger-menu-btn');
            await page.click('#logout_sidebar_link');
            await page.waitForURL(/saucedemo\.com\/?$/);
        });

        await step("Klik back browser dan verifikasi tetap di login page", async () => {
            await page.goBack();
            const currentUrl = page.url();
            expect(currentUrl).not.toContain("inventory.html");
        });
    });
});
