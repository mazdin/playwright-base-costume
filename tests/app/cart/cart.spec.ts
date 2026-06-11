import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";

test.describe("Cart Feature", () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await epic("SauceDemo");
        await feature("Cart");
        await inventoryPage.navigateHere();
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
    });

    test("CRT-01 | Navigasi kembali ke belanja", async ({ cartPage }) => {
        await story("Continue Shopping");
        await severity("normal");
        await description("Verifikasi user kembali ke halaman inventory saat klik 'Continue Shopping' dari cart.");
        await tag("navigation");

        await step("Klik Continue Shopping dan verifikasi redirect ke inventory", async () => {
            await cartPage.performContinueShopping();
        });
    });

    test("CRT-02 | Hapus item di halaman Cart", async ({ cartPage }) => {
        await story("Remove Item from Cart");
        await severity("normal");
        await description("Verifikasi item hilang dari daftar cart setelah diklik Remove.");
        await tag("smoke");

        await step("Klik Remove pada item dan verifikasi item hilang dari cart", async () => {
            await cartPage.performRemoveItemFromCart();
        });
    });
});
