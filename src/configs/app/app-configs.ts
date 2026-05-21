import BaseConfigs from "../../base/base-configs";

export default class AppConfigs extends BaseConfigs {
    private static _instance: AppConfigs;

    static get Instance(): AppConfigs {
        return AppConfigs._instance ?? (AppConfigs._instance = new AppConfigs());
    }

    get get() {
        return {
            // TODO: tambahkan konfigurasi aplikasi di sini
            // contoh:
            company: process.env.APP_COMPANY ?? "",
            branch: process.env.APP_BRANCH ?? "",
        };
    }
}
