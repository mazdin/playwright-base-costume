import BaseUrl from "../../base/base-url";

export default class AppUrls extends BaseUrl {
    private static _instance: AppUrls;

    static get Instance(): AppUrls {
        return AppUrls._instance ?? (AppUrls._instance = new AppUrls());
    }

    baseUrl = (): string => process.env.BASE_URL ?? "";

    get get() {
        return {
            login: {
                loginUrl: "/",
            },
            inventory: {
                inventoryUrl: "/inventory.html",
            },
            cart: {
                cartUrl: "/cart.html",
            },
            checkoutInfo: {
                checkoutInfoUrl: "/checkout-step-one.html",
            },
            checkoutOverview: {
                checkoutOverviewUrl: "/checkout-step-two.html",
            },
            checkoutComplete: {
                checkoutCompleteUrl: "/checkout-complete.html",
            },
        };
    }
}
