import { expect } from "@playwright/test";
import { test, NO_AUTH_STATE } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import { USERS } from "@data/users";

test.use({ storageState: NO_AUTH_STATE });

test.describe("Security Feature", () => {
    test("SEC-01 | Akses langsung URL inventory tanpa login", async ({ loginPage }) => {
        await epic("SauceDemo");
        await feature("Security");
        await story("Direct URL Access Without Auth");
        await severity("critical");
        await description(
            "Verifikasi user tidak bisa membuka /inventory.html secara langsung tanpa login (harus muncul error & tetap di login page).",
        );
        await tag("security");

        await step("Buka login page", async () => {
            await loginPage.navigateHere();
        });
        await step("Akses langsung URL inventory dan verifikasi ditolak", async () => {
            await loginPage.expectInventoryAccessBlocked();
        });
    });

    test("SEC-02 | Back Button setelah logout tidak bisa masuk kembali", async ({ loginPage, inventoryPage, page }) => {
        await epic("SauceDemo");
        await feature("Security");
        await story("Back Button After Logout");
        await severity("critical");
        await description(
            "Verifikasi user tidak bisa kembali ke halaman inventory setelah logout menggunakan tombol back browser.",
        );
        await tag("security");

        await step("Login dengan kredensial valid", async () => {
            await loginPage.navigateHere();
            await loginPage.login(USERS.standard.username, USERS.standard.password);
            await loginPage.expectLoginSuccess();
        });

        await step("Logout via burger menu", async () => {
            await inventoryPage.performLogout();
        });

        await step("Klik back browser dan verifikasi tetap di login page", async () => {
            await page.goBack();
            await expect(page).not.toHaveURL(/inventory\.html/);
        });
    });
});
