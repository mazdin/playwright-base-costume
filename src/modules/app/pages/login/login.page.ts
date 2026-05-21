import LoginLocator from "./login.locator";
import Element from "../../../../base/objects/Element";
import LoginScenario from "./login.scenario";
import BaseAppPage from "../../base/base-app-page";

export default class LoginPage extends BaseAppPage implements LoginScenario {
    private username = process.env.USEREMAIL ?? "";
    private password = process.env.PASSWORD ?? "";

    pageUrl = (): string => this.urls.get.login.loginUrl;

    shouldHave(): Element[] {
        return [
            Element.ofInput(LoginLocator.inputUsername, ''),
            Element.ofInput(LoginLocator.inputPassword, ''),
            Element.ofSelector(LoginLocator.buttonLogin),
        ];
    }

    async performLogin(): Promise<void> {
        await this.fill(LoginLocator.inputUsername, this.username);
        await this.fill(LoginLocator.inputPassword, this.password);
        await this.click(LoginLocator.buttonLogin);
        await this.waitForUrl(this.urls.get.inventory.inventoryUrl);
    }

    async performLockedOutLogin(): Promise<void> {
        await this.fill(LoginLocator.inputUsername, "locked_out_user");
        await this.fill(LoginLocator.inputPassword, "secret_sauce");
        await this.click(LoginLocator.buttonLogin);
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible("Sorry, this user has been locked out.");
    }

    async performWrongLogin(): Promise<void> {
        await this.fill(LoginLocator.inputUsername, "standard_user");
        await this.fill(LoginLocator.inputPassword, "wrong_pass");
        await this.click(LoginLocator.buttonLogin);
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible("Username and password do not match");
    }

    async performEmptyFieldsLogin(): Promise<void> {
        await this.click(LoginLocator.buttonLogin);
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible("Username is required");
    }

    async performCaseSensitiveLogin(): Promise<void> {
        await this.fill(LoginLocator.inputUsername, "standard_user");
        await this.fill(LoginLocator.inputPassword, "SECRET_SAUCE");
        await this.click(LoginLocator.buttonLogin);
        await this.expectVisible(LoginLocator.errorMessage);
    }
}
