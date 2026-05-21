import { expect } from "@playwright/test";
import InventoryLocator from "./inventory.locator";
import Element from "../../../../base/objects/Element";
import InventoryScenario from "./inventory.scenario";
import BaseAppPage from "../../base/base-app-page";

export default class InventoryPage extends BaseAppPage implements InventoryScenario {
    pageUrl = (): string => this.urls.get.inventory.inventoryUrl;

    shouldHave(): Element[] {
        return [
            Element.ofSelector(InventoryLocator.inventoryList),
            Element.ofSelector(InventoryLocator.sortDropdown),
        ];
    }

    async performAddToCart(): Promise<void> {
        await this.click(InventoryLocator.addToCartBackpack);
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.expectTextVisible("1", true);
    }

    async performRemoveFromCart(): Promise<void> {
        await this.click(InventoryLocator.addToCartBackpack);
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.click(InventoryLocator.removeBackpack);
        await this.expectInvisible(InventoryLocator.cartBadge);
    }

    async performSortZtoA(): Promise<void> {
        await this._page.selectOption(InventoryLocator.sortDropdown, 'za');
        const firstName = await this._page.locator(InventoryLocator.itemName).first().innerText();
        expect(firstName).toBe("Test.allTheThings() T-Shirt (Red)");
    }

    async performSortLowToHigh(): Promise<void> {
        await this._page.selectOption(InventoryLocator.sortDropdown, 'lohi');
        const firstPrice = await this._page.locator(InventoryLocator.itemPrice).first().innerText();
        expect(firstPrice).toBe("$7.99");
    }

    async performCheckProductImages(): Promise<void> {
        const images = await this._page.locator(InventoryLocator.itemImage).all();
        expect(images.length).toBeGreaterThan(0);
        for (const img of images) {
            await expect(img).toBeVisible();
        }
    }

    async performResetAppState(): Promise<void> {
        await this.click(InventoryLocator.addToCartBackpack);
        await this.expectVisible(InventoryLocator.cartBadge);
        await this.click(InventoryLocator.burgerMenu);
        await this.click(InventoryLocator.resetAppState);
        await this.click(InventoryLocator.closeMenu);
        await this.expectInvisible(InventoryLocator.cartBadge);
    }

    async performNavigateToProduct(productName: string): Promise<void> {
        await this._page.getByText(productName, { exact: true }).click();
        await this._page.waitForURL(/inventory-item\.html/);
    }
}
