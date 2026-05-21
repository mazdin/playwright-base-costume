import { Page } from "@playwright/test";

export default class Helper {
    static async waitForSelector(page: Page, selector: string) {
        await page.waitForSelector(selector);
    }

    static async delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    /**
     * @param input phone number string
     * @param lastComplete true : 81111111111 -> 811-1111-1111
     * @param lastComplete false : 81111111111 -> 8111-1111-111
     */
    static formatPhoneNumber(input: string, lastComplete: boolean = true): string {
        return lastComplete
            ? input.replace(/(\d)(?=(\d{4})+(?!\d))/g, "$1-")
            : input.replace(/(\d{4})(\d{4})(\d{3})/, "$1-$2-$3");
    }
}
