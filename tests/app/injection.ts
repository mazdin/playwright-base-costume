import { test as base } from "@playwright/test";
import { AppPages } from "../../src/modules/app/app-pages";
import LoginPage from "../../src/modules/app/pages/login/login.page";
import InventoryPage from "../../src/modules/app/pages/inventory/inventory.page";
import ProductPage from "../../src/modules/app/pages/product/product.page";
import CartPage from "../../src/modules/app/pages/cart/cart.page";
import CheckoutPage from "../../src/modules/app/pages/checkout/checkout.page";

export const test = base.extend<AppPages>({
    loginPage: async ({ page }, use) => await use(new LoginPage(page)),
    inventoryPage: async ({ page }, use) => await use(new InventoryPage(page)),
    productPage: async ({ page }, use) => await use(new ProductPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => await use(new CheckoutPage(page)),
});
