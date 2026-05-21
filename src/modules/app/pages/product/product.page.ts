import ProductLocator from "./product.locator";
import Element from "../../../../base/objects/Element";
import ProductScenario from "./product.scenario";
import BaseAppPage from "../../base/base-app-page";

export default class ProductPage extends BaseAppPage implements ProductScenario {
    pageUrl = (): string => this.urls.get.inventory.inventoryUrl;

    shouldHave(): Element[] {
        return [
            Element.ofSelector(ProductLocator.productName),
            Element.ofSelector(ProductLocator.productPrice),
            Element.ofSelector(ProductLocator.backButton),
        ];
    }

    async performCheckProductDetail(): Promise<void> {
        await this.expectVisible(ProductLocator.productName);
        await this.expectVisible(ProductLocator.productDescription);
        await this.expectVisible(ProductLocator.productPrice);
        await this.expectVisible(ProductLocator.productImage);
        await this.expectVisible(ProductLocator.backButton);
    }
}
