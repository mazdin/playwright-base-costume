import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import { PRODUCTS } from "@data/products";

test.describe("Product Feature", () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await epic("SauceDemo");
        await feature("Product Detail");
        await inventoryPage.navigateHere();
    });

    test("PDT-01 | Masuk ke detail produk", async ({ inventoryPage, productPage }) => {
        await story("Navigate to Product Detail");
        await severity("normal");
        await description("Verifikasi user berhasil pindah ke halaman detail produk saat klik nama produk.");
        await tag("navigation");

        await step(`Klik nama produk '${PRODUCTS.bikeLight}' dari halaman inventory`, async () => {
            await inventoryPage.performNavigateToProduct(PRODUCTS.bikeLight);
        });

        await step("Verifikasi elemen detail produk tampil dengan benar", async () => {
            await productPage.performCheckProductDetail();
        });
    });
});
