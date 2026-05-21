import CartLocator from "./cart.locator";
import Element from "../../../../base/objects/Element";
import CartScenario from "./cart.scenario";
import BaseAppPage from "../../base/base-app-page";

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
        const itemCountBefore = await this._page.locator(CartLocator.cartItem).count();
        await this._page.locator(CartLocator.removeButton).first().click();
        const itemCountAfter = await this._page.locator(CartLocator.cartItem).count();
        const { expect } = await import("@playwright/test");
        expect(itemCountAfter).toBeLessThan(itemCountBefore);
    }

    async performGoToCheckout(): Promise<void> {
        await this.click(CartLocator.checkoutButton);
        await this.waitForUrl(this.urls.get.checkoutInfo.checkoutInfoUrl);
    }
}
