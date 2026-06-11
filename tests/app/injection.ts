import { test as base } from "@playwright/test";
import { AppPages } from "@modules/app/app-pages";
import LoginPage from "@modules/app/pages/login/login.page";
import InventoryPage from "@modules/app/pages/inventory/inventory.page";
import ProductPage from "@modules/app/pages/product/product.page";
import CartPage from "@modules/app/pages/cart/cart.page";
import CheckoutPage from "@modules/app/pages/checkout/checkout.page";

export const test = base.extend<AppPages>({
    loginPage: async ({ page }, use) => await use(new LoginPage(page)),
    inventoryPage: async ({ page }, use) => await use(new InventoryPage(page)),
    productPage: async ({ page }, use) => await use(new ProductPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => await use(new CheckoutPage(page)),
});

/** State kosong untuk spec yang harus mulai tanpa sesi login (login/security). */
export const NO_AUTH_STATE = { cookies: [], origins: [] };
