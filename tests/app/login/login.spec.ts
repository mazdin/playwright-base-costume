import { test, NO_AUTH_STATE } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";
import { USERS, INVALID_PASSWORD, UPPERCASE_PASSWORD } from "@data/users";

test.use({ storageState: NO_AUTH_STATE });

test.describe("Login Feature", () => {
    test.beforeEach(async ({ loginPage }) => {
        await epic("SauceDemo");
        await feature("Login");
        await loginPage.navigateHere();
    });

    test("LGN-01 | Login dengan kredensial valid", async ({ loginPage }) => {
        await story("Valid Login");
        await severity("critical");
        await description("Verifikasi user dapat login menggunakan kredensial yang valid (standard_user).");
        await tag("smoke");

        await step("Masukkan username dan password valid", async () => {
            await loginPage.login(USERS.standard.username, USERS.standard.password);
        });
        await step("Verifikasi redirect ke halaman inventory", async () => {
            await loginPage.expectLoginSuccess();
        });
    });

    test("LGN-02 | Login dengan user terblokir", async ({ loginPage }) => {
        await story("Locked Out User");
        await severity("critical");
        await description("Verifikasi muncul error saat login dengan akun yang diblokir (locked_out_user).");
        await tag("negative");

        await step("Login dengan locked_out_user", async () => {
            await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
        });
        await step("Verifikasi pesan error user terblokir", async () => {
            await loginPage.expectLoginError("Sorry, this user has been locked out.");
        });
    });

    test("LGN-03 | Login dengan password salah", async ({ loginPage }) => {
        await story("Wrong Password");
        await severity("normal");
        await description("Verifikasi muncul error saat login dengan password yang salah.");
        await tag("negative");

        await step("Login dengan password salah", async () => {
            await loginPage.login(USERS.standard.username, INVALID_PASSWORD);
        });
        await step("Verifikasi pesan error kredensial tidak cocok", async () => {
            await loginPage.expectLoginError("Username and password do not match");
        });
    });

    test("LGN-04 | Login dengan field kosong", async ({ loginPage }) => {
        await story("Empty Fields");
        await severity("normal");
        await description("Verifikasi muncul error 'Username is required' saat semua field dikosongkan.");
        await tag("boundary");

        await step("Klik login tanpa mengisi field", async () => {
            await loginPage.login("", "");
        });
        await step("Verifikasi pesan error username wajib diisi", async () => {
            await loginPage.expectLoginError("Username is required");
        });
    });

    test("LGN-05 | Case sensitivity pada password", async ({ loginPage }) => {
        await story("Case Sensitive Password");
        await severity("minor");
        await description("Verifikasi login gagal saat password dimasukkan dengan huruf kapital semua (SECRET_SAUCE).");
        await tag("negative");

        await step("Login dengan password huruf kapital", async () => {
            await loginPage.login(USERS.standard.username, UPPERCASE_PASSWORD);
        });
        await step("Verifikasi login gagal", async () => {
            await loginPage.expectLoginError("Username and password do not match");
        });
    });
});
