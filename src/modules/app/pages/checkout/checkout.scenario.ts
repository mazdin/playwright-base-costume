import BaseScenario from "../../../../base/base-scenario";

export default interface CheckoutScenario extends BaseScenario {
    performFillInfo(firstName: string, lastName: string, postalCode: string): Promise<void>;
    performEmptyInfoContinue(): Promise<void>;
    performWhitespaceInfoContinue(): Promise<void>;
    performVerifyTax(): Promise<void>;
}
