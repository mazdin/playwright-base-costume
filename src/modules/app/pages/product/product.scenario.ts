import BaseScenario from "../../../../base/base-scenario";

export default interface ProductScenario extends BaseScenario {
    performCheckProductDetail(): Promise<void>;
}
