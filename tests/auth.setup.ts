import { test as setup } from "./app/injection";
import { USERS } from "@data/users";
import { STORAGE_STATE } from "../playwright.config";

/**
 * Login sekali via UI, simpan session ke .auth/user.json.
 * Semua project "chromium" mulai dalam keadaan sudah login (lihat playwright.config.ts).
 */
setup("authenticate as standard user", async ({ loginPage, page }) => {
    await loginPage.navigateHere();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.expectLoginSuccess();
    await page.context().storageState({ path: STORAGE_STATE });
});
