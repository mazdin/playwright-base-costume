import LoginPage from "./pages/login/login.page";
import InventoryPage from "./pages/inventory/inventory.page";
import ProductPage from "./pages/product/product.page";
import CartPage from "./pages/cart/cart.page";
import CheckoutPage from "./pages/checkout/checkout.page";

export type AppPages = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    productPage: ProductPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};
