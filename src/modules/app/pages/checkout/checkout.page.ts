import { expect } from "@playwright/test";
import CheckoutLocator from "./checkout.locator";
import Element from "../../../../base/objects/Element";
import CheckoutScenario from "./checkout.scenario";
import BaseAppPage from "../../base/base-app-page";

export default class CheckoutPage extends BaseAppPage implements CheckoutScenario {
    pageUrl = (): string => this.urls.get.checkoutInfo.checkoutInfoUrl;

    shouldHave(): Element[] {
        return [
            Element.ofInput(CheckoutLocator.firstNameInput, ''),
            Element.ofInput(CheckoutLocator.lastNameInput, ''),
            Element.ofInput(CheckoutLocator.postalCodeInput, ''),
            Element.ofSelector(CheckoutLocator.continueButton),
        ];
    }

    async performFillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.fill(CheckoutLocator.firstNameInput, firstName);
        await this.fill(CheckoutLocator.lastNameInput, lastName);
        await this.fill(CheckoutLocator.postalCodeInput, postalCode);
        await this.click(CheckoutLocator.continueButton);
        await this.waitForUrl(this.urls.get.checkoutOverview.checkoutOverviewUrl);
    }

    async performEmptyInfoContinue(): Promise<void> {
        await this.click(CheckoutLocator.continueButton);
        await this.expectVisible(CheckoutLocator.errorMessage);
        await this.expectTextVisible("First Name is required");
    }

    async performWhitespaceInfoContinue(): Promise<void> {
        await this._page.fill(CheckoutLocator.firstNameInput, "   ");
        await this._page.fill(CheckoutLocator.lastNameInput, "   ");
        await this._page.fill(CheckoutLocator.postalCodeInput, "   ");
        await this.click(CheckoutLocator.continueButton);
        // SauceDemo tidak memvalidasi whitespace — lanjut ke step 2
        await this.waitForUrl(this.urls.get.checkoutOverview.checkoutOverviewUrl);
    }

    async performVerifyTax(): Promise<void> {
        const subtotalText = await this.getTextValue(CheckoutLocator.subtotalLabel);
        const taxText = await this.getTextValue(CheckoutLocator.taxLabel);

        const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
        const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));

        const expectedTax = Math.round(subtotal * 0.08 * 100) / 100;
        expect(tax).toBeCloseTo(expectedTax, 1);
    }
}
