import BaseScenario from "@base/base-scenario";
import { CheckoutInfo } from "@data/checkout-data";

export default interface CheckoutScenario extends BaseScenario {
    performFillInfo(info: CheckoutInfo): Promise<void>;
    performEmptyInfoContinue(): Promise<void>;
    performVerifyTax(): Promise<void>;
    performFinishOrder(): Promise<void>;
}
