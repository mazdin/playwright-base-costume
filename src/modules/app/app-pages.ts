import LoginPage from "@modules/app/pages/login/login.page";
import InventoryPage from "@modules/app/pages/inventory/inventory.page";
import ProductPage from "@modules/app/pages/product/product.page";
import CartPage from "@modules/app/pages/cart/cart.page";
import CheckoutPage from "@modules/app/pages/checkout/checkout.page";

export type AppPages = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};
