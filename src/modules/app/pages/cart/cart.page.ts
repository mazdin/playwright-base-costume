import { expect } from "@playwright/test";
import CartLocator from "./cart.locator";
import Element from "@base/objects/Element";
import CartScenario from "./cart.scenario";
import BaseAppPage from "@modules/app/base/base-app-page";

export default class CartPage extends BaseAppPage implements CartScenario {
    pageUrl = (): string => this.urls.get.cart.cartUrl;

    shouldHave(): Element[] {
        return [
            Element.ofSelector(CartLocator.cartList),
            Element.ofSelector(CartLocator.continueShoppingButton),
            Element.ofSelector(CartLocator.checkoutButton),
        ];
    }

    async performContinueShopping(): Promise<void> {
        await this.click(CartLocator.continueShoppingButton);
        await this.waitForUrl(this.urls.get.inventory.inventoryUrl);
    }

    async performRemoveItemFromCart(): Promise<void> {
        const items = this.getLocator(CartLocator.cartItem);
        const itemCountBefore = await items.count();
        await this.getLocator(CartLocator.removeButton).first().click();
        await expect(items).toHaveCount(itemCountBefore - 1);
    }

    async performGoToCheckout(): Promise<void> {
        await this.click(CartLocator.checkoutButton);
        await this.waitForUrl(this.urls.get.checkoutInfo.checkoutInfoUrl);
    }
}
