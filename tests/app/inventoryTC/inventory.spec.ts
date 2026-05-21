import { test } from "../injection";
import { epic, feature, story, severity, description, tag, step } from "allure-js-commons";

test.describe("Inventory Feature", () => {
    test.beforeEach(async ({ loginPage }) => {
        await epic("SauceDemo");
        await feature("Inventory");
        await loginPage.navigateHere();
        await loginPage.performLogin();
    });

    test("INV-01 | Menambah produk ke keranjang", async ({ inventoryPage }) => {
        await story("Add to Cart");
        await severity("critical");
        await description("Verifikasi badge keranjang bertambah saat produk ditambahkan ke cart.");
        await tag("smoke");

        await step("Klik Add to Cart pada Sauce Labs Backpack", async () => {
            await inventoryPage.performAddToCart();
        });
    });

    test("INV-02 | Menghapus produk dari Home", async ({ inventoryPage }) => {
        await story("Remove from Cart");
        await severity("normal");
        await description("Verifikasi badge keranjang berkurang/hilang saat produk dihapus dari halaman inventory.");
        await tag("smoke");

        await step("Tambah produk lalu klik Remove, verifikasi badge hilang", async () => {
            await inventoryPage.performRemoveFromCart();
        });
    });

    test("INV-03 | Sortir Nama (Z to A)", async ({ inventoryPage }) => {
        await story("Sort Products");
        await severity("normal");
        await description("Verifikasi produk pertama adalah 'Test.allTheThings() T-Shirt (Red)' setelah sort Z to A.");
        await tag("sorting");

        await step("Pilih sort 'Name (Z to A)' dan verifikasi urutan produk", async () => {
            await inventoryPage.performSortZtoA();
        });
    });

    test("INV-04 | Sortir Harga (Low to High)", async ({ inventoryPage }) => {
        await story("Sort Products");
        await severity("normal");
        await description("Verifikasi produk pertama seharga $7.99 setelah sort Price Low to High.");
        await tag("sorting");

        await step("Pilih sort 'Price (low to high)' dan verifikasi harga pertama", async () => {
            await inventoryPage.performSortLowToHigh();
        });
    });

    test("INV-05 | Cek gambar produk (Standard User)", async ({ inventoryPage }) => {
        await story("Product Images");
        await severity("minor");
        await description("Verifikasi semua gambar produk tampil dengan benar untuk standard_user.");
        await tag("visual");

        await step("Periksa semua gambar produk visible", async () => {
            await inventoryPage.performCheckProductImages();
        });
    });

    test("INV-06 | Reset App State", async ({ inventoryPage }) => {
        await story("Reset App State");
        await severity("normal");
        await description("Verifikasi keranjang kembali kosong dan button ter-reset setelah Reset App State.");
        await tag("state");

        await step("Tambah item, buka sidebar, klik Reset App State, verifikasi badge hilang", async () => {
            await inventoryPage.performResetAppState();
        });
    });
});
