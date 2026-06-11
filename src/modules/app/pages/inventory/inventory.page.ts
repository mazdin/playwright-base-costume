import { expect } from "@playwright/test";
import InventoryLocator from "./inventory.locator";
import Element from "@base/objects/Element";
import InventoryScenario from "./inventory.scenario";
import BaseAppPage from "@modules/app/base/base-app-page";
import { SORT_EXPECTATIONS } from "@data/products";

export default class InventoryPage extends BaseAppPage implements InventoryScenario {
    pageUrl = (): string => this.urls.get.inventory.inventoryUrl;

    shouldHave(): Element[] {
        return [
            Element.ofSelector(InventoryLocator.inventoryList),
            Element.ofSelector(InventoryLocator.sortDropdown),
        ];
    }

    async addItemToCart(): Promise<void> {
        await this.click(InventoryLocator.addToCartBackpack);
    }

    async goToCart(): Promise<void> {
        await this.click(InventoryLocator.cartIcon);
        await this.waitForUrl(this.urls.get.cart.cartUrl);
    }

    async performAddToCart(): Promise<void> {
        await this.addItemToCart();
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.expectTextVisible("1", true);
    }

    async performRemoveFromCart(): Promise<void> {
        await this.addItemToCart();
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.click(InventoryLocator.removeBackpack);
        await this.expectInvisible(InventoryLocator.cartBadge);
    }

    async performSortZtoA(): Promise<void> {
        await this.selectOption(InventoryLocator.sortDropdown, 'za');
        await expect(this.getLocator(InventoryLocator.itemName).first())
            .toHaveText(SORT_EXPECTATIONS.firstNameZtoA);
    }

    async performSortLowToHigh(): Promise<void> {
        await this.selectOption(InventoryLocator.sortDropdown, 'lohi');
        await expect(this.getLocator(InventoryLocator.itemPrice).first())
            .toHaveText(SORT_EXPECTATIONS.lowestPrice);
    }

    async performCheckProductImages(): Promise<void> {
        const images = await this.getLocator(InventoryLocator.itemImage).all();
        expect(images.length).toBeGreaterThan(0);
        for (const img of images) {
            await expect(img).toBeVisible();
        }
    }

    async performResetAppState(): Promise<void> {
        await this.addItemToCart();
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.click(InventoryLocator.burgerMenu);
        await this.click(InventoryLocator.resetAppState);
        await this.click(InventoryLocator.closeMenu);
        await this.expectInvisible(InventoryLocator.cartBadge);
    }

    async performNavigateToProduct(productName: string): Promise<void> {
        await this.clickText(productName);
        await this._page.waitForURL(/inventory-item\.html/);
    }

    async performLogout(): Promise<void> {
        await this.click(InventoryLocator.burgerMenu);
        await this.click(InventoryLocator.logoutLink);
        await this._page.waitForURL(url => url.pathname === "/");
    }
}
