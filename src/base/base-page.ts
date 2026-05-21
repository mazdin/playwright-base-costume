import { expect, Page } from "@playwright/test";
import Element from "./objects/Element";
import BaseScenario from "./base-scenario";
import BaseUrl from "./base-url";
import { Keyboard } from "./constants/Keyboard";
import BaseConfigs from "./base-configs";
import { ConnectionOptions, createConnection } from "mysql2/promise";
import Helper from "./utils/helper";

export default abstract class BasePage<T extends BaseUrl, U extends BaseConfigs> implements BaseScenario {
    protected _page: Page;
    protected urls: T;
    protected configs: U;

    protected constructor(page: Page, urls: T, configs: U) {
        this._page = page;
        this.urls = urls;
        this.configs = configs;
    }

    protected readonly SPINNER_TIMEOUT = 30000;
    protected readonly ELEMENT_TIMEOUT = 15000;
    protected readonly PAGE_LOAD_TIMEOUT = 60000;

    abstract pageUrl: () => string;

    abstract shouldHave(): Element[];

    protected get baseUrl(): string {
        return this.urls.baseUrl();
    }

    async navigateHere(performInitialCheck: boolean = true): Promise<void> {
        await this.navigateTo(this.pageUrl());
        if (performInitialCheck) await this.performCheckInitialElements();
    }

    public async gotoPage<P extends BasePage<T, U>>(
        pageCreator: new (page: Page, urls: T, configs: U) => P,
        performInitialCheck: boolean = true,
    ): Promise<P> {
        let newPage: P = new pageCreator(this._page, this.urls, this.configs);
        await newPage.navigateHere(performInitialCheck);
        return newPage;
    }

    protected async clickAndExpectGotoPage<P extends BasePage<T, U>>(
        selector: string,
        pageCreator: new (page: Page, urls: T, configs: U) => P,
    ): Promise<P> {
        await this._page.click(selector);
        let newPage: P = new pageCreator(this._page, this.urls, this.configs);
        await this.waitForUrl(newPage.pageUrl());
        await newPage.performCheckInitialElements();
        return newPage;
    }

    public async goBackAndExpectGotoPage<P extends BasePage<T, U>>(
        pageCreator: new (page: Page, urls: T, configs: U) => P,
    ): Promise<P> {
        await this._page.goBack();
        let newPage: P = new pageCreator(this._page, this.urls, this.configs);
        await this.waitForUrl(newPage.pageUrl());
        await newPage.performCheckInitialElements();
        return newPage;
    }

    public async performCheckInitialElements(): Promise<void> {
        let promises: Promise<void>[] = this.shouldHave().map(element => element.validate(this));
        await Promise.all(promises);
    }

    async navigateTo(url: string): Promise<void> {
        await this._page.goto(this.baseUrl + url);
    }

    getTitle(): Promise<String> {
        return this._page.title();
    }

    protected async clear(fieldSelector: string): Promise<void> {
        await this.fill(fieldSelector, '');
        await expect(this._page.locator(fieldSelector)).toHaveValue('');
    }

    public async fill(selector: string, value: string): Promise<void> {
        console.log(`fill ${selector} with ${value}`);
        await this._page.fill(selector, value);
        await this.expectHasValue(selector, value);
    }

    public async fillPhone(selector: string, value: string, lastComplete: boolean = true): Promise<void> {
        console.log(`fill ${selector} with ${value}`);
        await this._page.fill(selector, value);
        await this.expectHasValue(selector, Helper.formatPhoneNumber(value, lastComplete));
    }

    public click(selector: string): Promise<void> {
        console.log(`click : ${selector}`);
        return this._page.click(selector);
    }

    protected clickText(text: string): Promise<void> {
        console.log(`click text:  ${text}`);
        return this._page.getByText(text).click();
    }

    protected clickButtonByText(text: string): Promise<void> {
        console.log(`click button by text:  ${text}`);
        return this._page.getByRole('button', { name: text }).click();
    }

    public expectEnabled(selector: string): Promise<void> {
        console.log(`expect enabled:  ${selector}`);
        return expect(this._page.locator(selector)).toBeEnabled();
    }

    public expectDisabled(selector: string): Promise<void> {
        console.log(`expect disabled:  ${selector}`);
        return expect(this._page.locator(selector)).toBeDisabled();
    }

    public expectVisible(selector: string): Promise<void> {
        console.log(`expect visible:  ${selector}`);
        return expect(this._page.locator(selector)).toBeVisible();
    }

    public async expectVisibleWithTimeOut(selector: string, customTimeout?: number): Promise<void> {
        const timeout = customTimeout ?? 5000;
        console.log(`expect visible (timeout: ${timeout}ms): ${selector}`);
        await expect(this._page.locator(selector)).toBeVisible({ timeout });
    }

    protected async expectInvisible(selector: string, customTimeout?: number): Promise<void> {
        const timeout = customTimeout ?? 5000;
        console.log(`expect hidden (timeout: ${timeout}ms): ${selector}`);
        await expect(this._page.locator(selector)).toBeHidden({ timeout });
    }

    public expectTextVisible(text: string, exact: boolean = false): Promise<void> {
        console.log(`expect text visible:  ${text} | exact : ${exact}`);
        return expect(this._page.getByText(text, { exact: exact })).toBeVisible();
    }

    public async expectTextVisibleTimout(text: string, exact: boolean = false, customTimeout?: number): Promise<void> {
        const timeout = customTimeout ?? 5000;
        const locator = this._page.getByText(text, { exact });
        await expect(locator).toBeVisible({ timeout });
    }

    protected expectTextInvisible(text: string, exact: boolean = false): Promise<void> {
        console.log(`check if text visible:  ${text} | exact : ${exact}`);
        return expect(this._page.getByText(text, { exact: exact })).toBeHidden();
    }

    public async expectHasValue(selector: string, value: string): Promise<void> {
        console.log(`check if : ${selector}  hasValue : ${value}`);
        return expect(this._page.locator(selector)).toHaveValue(value);
    }

    public async expectEmpty(selector: string): Promise<void> {
        console.log(`check if : ${selector}  empty`);
        return this.expectHasValue(selector, '');
    }

    public async expectHasElement(...elements: Element[]) {
        for (const element of elements) await element.validate(this);
    }

    public async expectHasButton(selector: string, value: string, enabled: boolean = true): Promise<void> {
        let e = expect(this._page.getByRole('button', { name: value }));
        if (enabled) return e.toBeEnabled();
        return e.toBeDisabled();
    }

    public async expectHasButtonWithID(selector: string, value: string, enabled: boolean = true): Promise<void> {
        let e = expect(this._page.locator(selector, { hasText: value }));
        if (enabled) return e.toBeEnabled();
        return e.toBeDisabled();
    }

    public async waitForResponse(urlOrPredicate: string) {
        console.log(`waiting for response API contain ${urlOrPredicate}`);
        return this._page.waitForResponse(new RegExp('\\b' + urlOrPredicate + '\\b')).then(response => {
            console.log("Response Received");
            console.log(response.url());
            console.log(response.ok());
            console.log(response.status());
            console.log(response.statusText());
            return response;
        });
    }

    public async waitForVisible(
        selector: string,
        onVisible: () => Promise<void>,
        duration: number = 200,
        retry: number = 5,
    ): Promise<void> {
        for (let i = 0; i < retry; i++) {
            console.log(`waitForVisible: ${selector}, for ${duration * (i + 1)}`);
            await this.wait(duration);
            if (await this.isVisible(selector)) {
                console.log(`waitForVisible: ${selector}, it's visible!`);
                await onVisible();
                return;
            }
        }
        console.log(`waitForVisible: ${selector}, it's not visible!`);
    }

    public async waitForInvisible(
        selector: string,
        onInvisible: () => Promise<void>,
        duration: number = 100,
        retry: number = 15,
    ): Promise<void> {
        for (let i = 0; i < retry; i++) {
            console.log(`waitForInvisible: ${selector}, for ${duration * (i + 1)}`);
            await this.wait(duration);
            if (await this.isInvisible(selector)) {
                console.log(`waitForInvisible: ${selector}, it's invisible!`);
                await onInvisible();
                return;
            }
        }
        console.log(`waitForInvisible: ${selector}, it's not invisible!`);
    }

    public pressKeyboard(...keys: Keyboard[]): Promise<void> {
        return this._page.keyboard.press(keys.map(key => `${key}`).join("+"));
    }

    protected typeKeyboard(text: string): Promise<void> {
        return this._page.keyboard.type(text);
    }

    protected waitForUrl(urlOrPredicate: string): Promise<void> {
        return this._page.waitForURL(new RegExp('\\b' + urlOrPredicate + '\\b'));
    }

    protected async waitForUrlWithTimeOut(urlOrPredicate: string, customTimeout?: number): Promise<void> {
        const timeout = customTimeout ?? 10000;
        await this._page.waitForURL(
            new RegExp(`\\b${urlOrPredicate}\\b`),
            { timeout }
        );
    }

    public wait(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    protected isEnabled(selector: string): Promise<boolean> {
        return this._page.locator(selector).isEnabled();
    }

    protected isChecked(selector: string): Promise<boolean> {
        console.log(`check if checked:  ${selector}`);
        return this._page.locator(selector).isChecked();
    }

    public async isVisible(selector: string, timeout: number = 2000): Promise<boolean> {
        try {
            console.log(`check if visible:  ${selector}`);
            await this._page.locator(selector).waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    public isInvisible(selector: string): Promise<boolean> {
        console.log(`check if visible:  ${selector}`);
        return this._page.locator(selector).isHidden();
    }

    protected isTextVisible(text: string): Promise<boolean> {
        console.log(`check if text visible:  ${text}`);
        return this._page.getByText(text).isVisible();
    }

    protected async expectDownloadFile(filename: string, extension: string): Promise<void> {
        const download = await this._page.waitForEvent('download');
        const downloadedFile = download.suggestedFilename();
        console.log(`check if file Downloaded: ${filename}%${extension}`);
        return expect(downloadedFile.startsWith(filename) && downloadedFile.endsWith(extension)).toBe(true);
    }

    public getLocator(selector: string) {
        return this._page.locator(selector);
    }

    public async makeApiRequest<T>(endpoint: string, options: {
        method?: string,
        headers?: Record<string, string>,
        body?: any,
        baseUrl?: string
    } = {}): Promise<{ status: number; statusText: string; data: T }> {
        console.log(`Making API request to: ${endpoint}`);
        const { method = "GET", headers = {}, body, baseUrl = this.baseUrl } = options;
        return this._page.evaluate(async ({ endpoint, method, headers, body }) => {
            try {
                const response = await fetch(endpoint, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                });
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                return { status: response.status, statusText: response.statusText, data };
            } catch (error) {
                console.error("Error during API request:", error);
                throw error;
            }
        }, { endpoint: baseUrl + endpoint, method, headers, body });
    }

    public async sqlExecute(dbConfig: ConnectionOptions, query: string): Promise<any> {
        const connection = await createConnection(dbConfig);
        try {
            console.log("Connected to the database");
            const result = await connection.execute(query);
            console.log("Query executed successfully");
            return result;
        } catch (error) {
            console.error("Error executing query:", error);
        } finally {
            await connection.end();
        }
    }

    public async setLocalStorage(key: string, value: string): Promise<void> {
        try {
            console.log(`Set local Storage "${key}":"${value}"`);
            await this._page.evaluate(async ([key, value]) => localStorage.setItem(key, value), [key, value]);
            console.log("Success set local Storage");
        } catch (error) {
            console.error("Error set localStorage:", error);
        }
    }

    public async getLocalStorage(key: string): Promise<string> {
        try {
            console.log(`Get local Storage of "${key}"`);
            const result = await this._page.evaluate((key) => localStorage.getItem(key), key);
            return result ?? "";
        } catch (error) {
            console.error("Error get localStorage:", error);
            return "";
        }
    }

    public async removeLocalStorage(key: string): Promise<void> {
        try {
            console.log(`Remove local Storage of "${key}"`);
            await this._page.evaluate((key) => localStorage.removeItem(key), key);
            console.log(`Success remove local Storage of "${key}"`);
        } catch (error) {
            console.error("Error remove localStorage:", error);
        }
    }

    public async clearLocalStorage(): Promise<void> {
        try {
            console.log(`Remove local Storage`);
            await this._page.evaluate(() => localStorage.clear());
            console.log(`Success clear all local Storage`);
        } catch (error) {
            console.error("Error clear localStorage:", error);
        }
    }

    public async getAllLocalStorage(): Promise<Record<string, string>> {
        try {
            console.log(`Get All local Storage`);
            return await this._page.evaluate(() => {
                const allLocalStorage: Record<string, string> = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        allLocalStorage[key] = localStorage.getItem(key) ?? "";
                    }
                }
                return allLocalStorage;
            });
        } catch (error) {
            console.error("Error get all localStorage:", error);
            return {};
        }
    }

    public async getInputValue(locator: string): Promise<string> {
        return await this._page.locator(locator).inputValue();
    }

    public async getTextValue(locator: string): Promise<string> {
        console.log(`Getting text value from locator: ${locator}`);
        return await this._page.locator(locator).innerText();
    }

    async getStableText(locator: string, timeout: number = 10000): Promise<string> {
        const element = this._page.locator(locator);
        await element.waitFor({ state: "visible", timeout });
        await expect(element).not.toHaveText("", { timeout });
        await this._page.waitForLoadState("networkidle");
        const text = await element.innerText();
        return text.trim();
    }

    public async setGeoLocation(latitude: number, longitude: number): Promise<void> {
        await this._page.context().setGeolocation({ latitude: latitude, longitude: longitude });
        await this._page.context().grantPermissions(['geolocation']);
    }

    public async expectHasOneElement(selector: string) {
        console.log(`expect only one element:  ${selector}`);
        return expect(this._page.locator(selector).count()).toBe(1);
    }

    public async expectHasElements(selector: string) {
        console.log(`expect one or more element:  ${selector}`);
        return expect(await this._page.locator(selector).count()).toBeGreaterThanOrEqual(1);
    }

    public async expectHasEmptyElement(selector: string) {
        console.log(`expect empty element:  ${selector}`);
        return expect(await this._page.locator(selector).count()).toBe(0);
    }

    public async expectOpenNewTab(url: string) {
        const newTabPromise = this._page.waitForEvent("popup");
        const newTab = await newTabPromise;
        await newTab.waitForLoadState();
        console.log(`open url in new tab: ${url}`);
        await expect(newTab).toHaveURL(url);
    }

    protected async waitForNewTab(timeout: number = 10000): Promise<number> {
        const context = this._page.context();
        const previousPageCount = context.pages().length;
        console.log("Menunggu tab baru terbuka...");
        await context.waitForEvent("page", { timeout });
        const currentPages = context.pages();
        if (currentPages.length <= previousPageCount) {
            throw new Error("Tidak ada tab baru yang terbuka.");
        }
        const newTabIndex = currentPages.length - 1;
        console.log(`Tab baru terdeteksi! Index Tab: ${newTabIndex}`);
        return newTabIndex;
    }

    public async switchToTab(tabIndex: number): Promise<void> {
        const pages = this._page.context().pages();
        if (!pages[tabIndex]) {
            throw new Error(`Tab index ${tabIndex} tidak ditemukan.`);
        }
        this._page = pages[tabIndex];
        await this._page.bringToFront();
        console.log(`Berhasil berpindah ke tab ke-${tabIndex + 1}`);
    }

    public async isCurrentUrlContains(expectedUrlPart: string, timeout: number = 2000): Promise<boolean> {
        try {
            await this._page.waitForURL(
                (url) => url.toString().includes(expectedUrlPart),
                { timeout }
            );
            return true;
        } catch {
            return false;
        }
    }

    protected async typeByKeyboard(selector: string, value: string, customTimeout?: number): Promise<void> {
        const timeout = customTimeout ?? 5000;
        console.log(`typeByKeyboard ${selector} with "${value}"`);
        const locator = this._page.locator(selector);
        await expect(locator).toBeVisible({ timeout });
        await locator.click();
        await this._page.keyboard.type(value);
    }

    protected async waitForSpinnersToDisappear(
        spinnerLocator: string,
        timeout: number = this.SPINNER_TIMEOUT
    ): Promise<void> {
        try {
            await expect(this._page.locator(spinnerLocator)).toHaveCount(0, { timeout });
        } catch (error) {
            console.warn(`Spinner '${spinnerLocator}' still visible after ${timeout}ms`);
            throw error;
        }
    }

    formatPickerDate(date: Date): string {
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    getTomorrowDate(baseDate: string): string {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + 1);
        return this.formatPickerDate(date);
    }

    getYesterdayDate(baseDate: string): string {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - 1);
        return this.formatPickerDate(date);
    }
}
