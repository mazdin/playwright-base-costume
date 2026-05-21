import BaseLocator from "../../../../base/base-locator";

export default class LoginLocator extends BaseLocator {
    static inputUsername: string = '#user-name';
    static inputPassword: string = '#password';
    static buttonLogin: string = '#login-button';
    static errorMessage: string = '[data-test="error"]';
}
