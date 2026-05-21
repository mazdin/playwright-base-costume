import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";

test.describe("Product Feature", () => {
    test.beforeEach(async ({ loginPage }) => {
        await epic("SauceDemo");
        await feature("Product Detail");
        await loginPage.navigateHere();
        await loginPage.performLogin();
    });

    test("PDT-01 | Masuk ke detail produk", async ({ inventoryPage, productPage }) => {
        await story("Navigate to Product Detail");
        await severity("normal");
        await description("Verifikasi user berhasil pindah ke halaman detail produk saat klik nama produk.");
        await tag("navigation");

        await step("Klik nama produk 'Sauce Labs Bike Light' dari halaman inventory", async () => {
            await inventoryPage.performNavigateToProduct("Sauce Labs Bike Light");
        });

        await step("Verifikasi elemen detail produk tampil dengan benar", async () => {
            await productPage.performCheckProductDetail();
        });
    });
});
