import BaseScenario from "@base/base-scenario";

export default interface LoginScenario extends BaseScenario {
    login(username: string, password: string): Promise<void>;
    expectLoginSuccess(): Promise<void>;
    expectLoginError(message: string): Promise<void>;
}
