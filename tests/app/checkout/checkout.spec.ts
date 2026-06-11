import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import { CHECKOUT_INFO } from "@data/checkout-data";

test.describe("Checkout Feature", () => {
    test.beforeEach(async ({ inventoryPage, cartPage }) => {
        await epic("SauceDemo");
        await feature("Checkout");
        await inventoryPage.navigateHere();
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        await cartPage.performGoToCheckout();
    });

    test("CHK-01 | Checkout dengan data valid", async ({ checkoutPage }) => {
        await story("Valid Checkout Info");
        await severity("critical");
        await description("Verifikasi user lanjut ke Checkout Overview setelah mengisi data valid.");
        await tag("smoke");

        await step("Isi form dengan data valid dan klik Continue", async () => {
            await checkoutPage.performFillInfo(CHECKOUT_INFO.valid);
        });
    });

    test("CHK-02 | Form info kosong", async ({ checkoutPage }) => {
        await story("Empty Checkout Form");
        await severity("normal");
        await description("Verifikasi muncul error 'First Name is required' saat form dikosongkan.");
        await tag("negative");

        await step("Klik Continue tanpa mengisi form dan verifikasi error", async () => {
            await checkoutPage.performEmptyInfoContinue();
        });
    });

    test("CHK-03 | Input spasi saja pada form", async ({ checkoutPage }) => {
        await story("Whitespace Input");
        await severity("minor");
        await description("Verifikasi perilaku form saat semua field diisi spasi (SauceDemo tidak memvalidasi whitespace — lanjut ke overview).");
        await tag("edge-case");

        await step("Isi semua field dengan spasi dan verifikasi lanjut ke overview", async () => {
            await checkoutPage.performFillInfo(CHECKOUT_INFO.whitespace);
        });
    });

    test("CHK-04 | Verifikasi perhitungan pajak (8%)", async ({ checkoutPage }) => {
        await story("Tax Calculation");
        await severity("normal");
        await description("Verifikasi nilai Tax = 8% dari subtotal pada halaman Checkout Overview.");
        await tag("calculation");

        await step("Isi data valid hingga halaman overview", async () => {
            await checkoutPage.performFillInfo(CHECKOUT_INFO.valid);
        });
        await step("Verifikasi Tax = 8% dari Item total", async () => {
            await checkoutPage.performVerifyTax();
        });
    });
});
