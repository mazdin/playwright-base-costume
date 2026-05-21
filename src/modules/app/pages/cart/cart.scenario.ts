import BaseScenario from "../../../../base/base-scenario";

export default interface CartScenario extends BaseScenario {
    performContinueShopping(): Promise<void>;
    performRemoveItemFromCart(): Promise<void>;
    performGoToCheckout(): Promise<void>;
}
