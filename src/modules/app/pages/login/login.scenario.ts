import BaseScenario from "../../../../base/base-scenario";

export default interface LoginScenario extends BaseScenario {
    performLogin(): Promise<void>;
    performLockedOutLogin(): Promise<void>;
    performWrongLogin(): Promise<void>;
    performEmptyFieldsLogin(): Promise<void>;
    performCaseSensitiveLogin(): Promise<void>;
}
