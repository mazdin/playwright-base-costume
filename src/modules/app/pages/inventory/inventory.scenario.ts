import BaseScenario from "../../../../base/base-scenario";

export default interface InventoryScenario extends BaseScenario {
    performAddToCart(): Promise<void>;
    performRemoveFromCart(): Promise<void>;
    performSortZtoA(): Promise<void>;
    performSortLowToHigh(): Promise<void>;
    performCheckProductImages(): Promise<void>;
    performResetAppState(): Promise<void>;
    performNavigateToProduct(productName: string): Promise<void>;
}
