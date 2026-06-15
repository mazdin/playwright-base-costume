import { test, NO_AUTH_STATE } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import { LOGINABLE_USERS } from "@data/users";

test.use({ storageState: NO_AUTH_STATE });

test.describe("Login Feature - Problem Users (data-driven)", () => {
    test.beforeEach(async ({ loginPage }) => {
        await epic("SauceDemo");
        await feature("Login");
        await loginPage.navigateHere();
    });

    for (const user of LOGINABLE_USERS) {
        test(`LGN-USR | ${user.username} dapat login & mencapai inventory`, async ({ loginPage }) => {
            await story("Multi-User Login Smoke");
            await severity("normal");
            await description(`Verifikasi '${user.username}' berhasil login dan halaman inventory ter-render.`);
            await tag("smoke");
            await tag("data-driven");

            // performance_glitch_user sengaja lambat — beri ruang timeout
            test.slow();

            await step(`Login sebagai ${user.username}`, async () => {
                await loginPage.login(user.username, user.password);
            });
            await step("Verifikasi inventory ter-render", async () => {
                await loginPage.expectLoginSuccess();
            });
        });
    }
});
