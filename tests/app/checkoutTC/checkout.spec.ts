import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import InventoryLocator from "../../../src/modules/app/pages/inventory/inventory.locator";

test.describe("Checkout Feature", () => {
    test.beforeEach(async ({ loginPage, inventoryPage }) => {
        await epic("SauceDemo");
        await feature("Checkout");
        await loginPage.navigateHere();
        await loginPage.performLogin();
        await inventoryPage.click(InventoryLocator.addToCartBackpack);
        await inventoryPage.click(InventoryLocator.cartIcon);
    });

    test("CHK-01 | Checkout dengan data valid", async ({ cartPage, checkoutPage }) => {
        await story("Valid Checkout Info");
        await severity("critical");
        await description("Verifikasi user lanjut ke Checkout Overview setelah mengisi data valid (Ani, Budi, 12345).");
        await tag("smoke");

        await step("Navigasi ke halaman checkout info", async () => {
            await cartPage.performGoToCheckout();
        });
        await step("Isi form dengan data valid dan klik Continue", async () => {
            await checkoutPage.performFillInfo("Ani", "Budi", "12345");
        });
    });

    test("CHK-02 | Form info kosong", async ({ cartPage, checkoutPage }) => {
        await story("Empty Checkout Form");
        await severity("normal");
        await description("Verifikasi muncul error 'First Name is required' saat form dikosongkan.");
        await tag("negative");

        await step("Navigasi ke halaman checkout info", async () => {
            await cartPage.performGoToCheckout();
        });
        await step("Klik Continue tanpa mengisi form dan verifikasi error", async () => {
            await checkoutPage.performEmptyInfoContinue();
        });
    });

    test("CHK-03 | Input spasi saja pada form", async ({ cartPage, checkoutPage }) => {
        await story("Whitespace Input");
        await severity("minor");
        await description("Verifikasi form tidak berlanjut ke overview saat semua field diisi spasi (SauceDemo memvalidasi whitespace — tetap di step 1).");
        await tag("edge-case");

        await step("Navigasi ke halaman checkout info", async () => {
            await cartPage.performGoToCheckout();
        });
        await step("Isi semua field dengan spasi dan verifikasi lanjut ke overview", async () => {
            await checkoutPage.performWhitespaceInfoContinue();
        });
    });

    test("CHK-04 | Verifikasi perhitungan pajak (8%)", async ({ cartPage, checkoutPage }) => {
        await story("Tax Calculation");
        await severity("normal");
        await description("Verifikasi nilai Tax = 8% dari subtotal pada halaman Checkout Overview.");
        await tag("calculation");

        await step("Navigasi ke halaman checkout info dan isi data valid", async () => {
            await cartPage.performGoToCheckout();
            await checkoutPage.performFillInfo("Ani", "Budi", "12345");
        });
        await step("Verifikasi Tax = 8% dari Item total", async () => {
            await checkoutPage.performVerifyTax();
        });
    });
});
