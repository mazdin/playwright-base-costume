import LoginLocator from "./login.locator";
import Element from "@base/objects/Element";
import LoginScenario from "./login.scenario";
import BaseAppPage from "@modules/app/base/base-app-page";

export default class LoginPage extends BaseAppPage implements LoginScenario {
    pageUrl = (): string => this.urls.get.login.loginUrl;

    shouldHave(): Element[] {
        return [
            Element.ofInput(LoginLocator.inputUsername, ''),
            Element.ofInput(LoginLocator.inputPassword, ''),
            Element.ofSelector(LoginLocator.buttonLogin),
        ];
    }

    async login(username: string, password: string): Promise<void> {
        if (username) await this.fill(LoginLocator.inputUsername, username);
        if (password) await this.fill(LoginLocator.inputPassword, password);
        await this.click(LoginLocator.buttonLogin);
    }

    async expectLoginSuccess(): Promise<void> {
        await this.waitForUrl(this.urls.get.inventory.inventoryUrl);
    }

    async expectLoginError(message: string): Promise<void> {
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible(message);
    }
}
