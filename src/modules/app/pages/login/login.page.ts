import LoginLocator from "./login.locator";
import Element from "@base/objects/Element";
import LoginScenario from "./login.scenario";
import BaseAppPage from "@modules/app/base/base-app-page";

export default class LoginPage extends BaseAppPage implements LoginScenario {
    pageUrl = (): string => this.urls.get.login.loginUrl;

    shouldHave(): Element[] {
        return [
            Element.ofInput(LoginLocator.inputUsername, ""),
            Element.ofInput(LoginLocator.inputPassword, ""),
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
        // Tidak cukup hanya URL — pastikan halaman inventory benar-benar ter-render
        await this.expectVisible(LoginLocator.inventoryListAfterLogin);
    }

    async expectLoginError(message: string): Promise<void> {
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible(message);
    }

    /** Akses langsung URL inventory tanpa login harus ditolak (tetap di login + error). */
    async expectInventoryAccessBlocked(): Promise<void> {
        await this.navigateTo(this.urls.get.inventory.inventoryUrl);
        await this.expectVisible(LoginLocator.errorMessage);
        await this.expectTextVisible("You can only access");
        await this.expectInvisible(LoginLocator.inventoryListAfterLogin);
    }
}
