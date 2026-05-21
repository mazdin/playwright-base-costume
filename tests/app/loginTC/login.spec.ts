import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";

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

        await step("Masukkan username dan password valid, verifikasi redirect ke inventory", async () => {
            await loginPage.performLogin();
        });
    });

    test("LGN-02 | Login dengan user terblokir", async ({ loginPage }) => {
        await story("Locked Out User");
        await severity("critical");
        await description("Verifikasi muncul error saat login dengan akun yang diblokir (locked_out_user).");
        await tag("negative");

        await step("Login dengan locked_out_user dan verifikasi pesan error", async () => {
            await loginPage.performLockedOutLogin();
        });
    });

    test("LGN-03 | Login dengan password salah", async ({ loginPage }) => {
        await story("Wrong Password");
        await severity("normal");
        await description("Verifikasi muncul error saat login dengan password yang salah.");
        await tag("negative");

        await step("Login dengan wrong_pass dan verifikasi pesan error", async () => {
            await loginPage.performWrongLogin();
        });
    });

    test("LGN-04 | Login dengan field kosong", async ({ loginPage }) => {
        await story("Empty Fields");
        await severity("normal");
        await description("Verifikasi muncul error 'Username is required' saat semua field dikosongkan.");
        await tag("boundary");

        await step("Klik login tanpa mengisi field dan verifikasi pesan error", async () => {
            await loginPage.performEmptyFieldsLogin();
        });
    });

    test("LGN-05 | Case sensitivity pada password", async ({ loginPage }) => {
        await story("Case Sensitive Password");
        await severity("minor");
        await description("Verifikasi login gagal saat password dimasukkan dengan huruf kapital semua (SECRET_SAUCE).");
        await tag("negative");

        await step("Login dengan PASSWORD kapital dan verifikasi gagal", async () => {
            await loginPage.performCaseSensitiveLogin();
        });
    });
});
