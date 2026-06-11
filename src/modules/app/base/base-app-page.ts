import { Page } from "@playwright/test";
import BasePage from "@base/base-page";
import AppUrls from "@configs/app/app-urls";
import AppConfigs from "@configs/app/app-configs";

export default abstract class BaseAppPage extends BasePage<AppUrls, AppConfigs> {
    constructor(page: Page) {
        super(page, AppUrls.Instance, AppConfigs.Instance);
    }
}
