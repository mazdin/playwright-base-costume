export default class LoginLocator {
    static inputUsername: string = "#user-name";
    static inputPassword: string = "#password";
    static buttonLogin: string = "#login-button";
    static errorMessage: string = '[data-test="error"]';
    /** Indikator login berhasil: container produk pada halaman inventory. */
    static inventoryListAfterLogin: string = ".inventory_list";
}
