import { expect } from "@playwright/test";
import CheckoutLocator from "./checkout.locator";
import Element from "@base/objects/Element";
import CheckoutScenario from "./checkout.scenario";
import BaseAppPage from "@modules/app/base/base-app-page";
import { CheckoutInfo, TAX_RATE } from "@data/checkout-data";

export default class CheckoutPage extends BaseAppPage implements CheckoutScenario {
    pageUrl = (): string => this.urls.get.checkoutInfo.checkoutInfoUrl;

    shouldHave(): Element[] {
        return [
            Element.ofInput(CheckoutLocator.firstNameInput, ""),
            Element.ofInput(CheckoutLocator.lastNameInput, ""),
            Element.ofInput(CheckoutLocator.postalCodeInput, ""),
            Element.ofSelector(CheckoutLocator.continueButton),
        ];
    }

    async performFillInfo(info: CheckoutInfo): Promise<void> {
        await this.fill(CheckoutLocator.firstNameInput, info.firstName);
        await this.fill(CheckoutLocator.lastNameInput, info.lastName);
        await this.fill(CheckoutLocator.postalCodeInput, info.postalCode);
        await this.click(CheckoutLocator.continueButton);
        await this.waitForUrl(this.urls.get.checkoutOverview.checkoutOverviewUrl);
    }

    async performEmptyInfoContinue(): Promise<void> {
        await this.click(CheckoutLocator.continueButton);
        await this.expectVisible(CheckoutLocator.errorMessage);
        await this.expectTextVisible("First Name is required");
    }

    async performVerifyTax(): Promise<void> {
        const subtotal = await this.readAmount(CheckoutLocator.subtotalLabel);
        const tax = await this.readAmount(CheckoutLocator.taxLabel);
        const total = await this.readAmount(CheckoutLocator.totalLabel);

        const expectedTax = Math.round(subtotal * TAX_RATE * 100) / 100;
        expect(tax).toBeCloseTo(expectedTax, 2);
        // Total yang dilihat user harus = subtotal + tax
        expect(total).toBeCloseTo(subtotal + tax, 2);
    }

    async performFinishOrder(): Promise<void> {
        await this.click(CheckoutLocator.finishButton);
        await this.waitForUrl(this.urls.get.checkoutComplete.checkoutCompleteUrl);
        await this.expectVisible(CheckoutLocator.completeHeader);
        await this.expectTextVisible("Thank you for your order!");
    }

    /** Baca label uang (mis. "Item total: $29.99") menjadi angka. */
    private async readAmount(selector: string): Promise<number> {
        const text = await this.getTextValue(selector);
        return parseFloat(text.replace(/[^0-9.]/g, ""));
    }
}
