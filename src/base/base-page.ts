import { expect, Page, test } from "@playwright/test";
import Element from "./objects/Element";
import BaseScenario from "./base-scenario";
import BaseUrl from "./base-url";
import { Keyboard } from "./constants/Keyboard";
import BaseConfigs from "./base-configs";

export default abstract class BasePage<T extends BaseUrl, U extends BaseConfigs> implements BaseScenario {
    protected _page: Page;
    protected urls: T;
    protected configs: U;

    protected constructor(page: Page, urls: T, configs: U) {
        this._page = page;
        this.urls = urls;
        this.configs = configs;
    }

    protected readonly ELEMENT_TIMEOUT = 5000;
    protected readonly NAVIGATION_TIMEOUT = 10000;

    abstract pageUrl: () => string;

    abstract shouldHave(): Element[];

    protected get baseUrl(): string {
        return this.urls.baseUrl();
    }

    protected step<R>(title: string, body: () => Promise<R>): Promise<R> {
        return test.step(title, body, { box: true });
    }

    async navigateHere(performInitialCheck: boolean = true): Promise<void> {
        await this.navigateTo(this.pageUrl());
        if (performInitialCheck) await this.performCheckInitialElements();
    }

    async navigateTo(url: string): Promise<void> {
        await this.step(`navigate to ${url}`, () => this._page.goto(this.baseUrl + url).then(() => undefined));
    }

    public async performCheckInitialElements(): Promise<void> {
        await this.step("check initial elements", async () => {
            for (const element of this.shouldHave()) await element.validate(this);
        });
    }

    getTitle(): Promise<string> {
        return this._page.title();
    }

    public getLocator(selector: string) {
        return this._page.locator(selector);
    }

    // ------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------

    public fill(selector: string, value: string): Promise<void> {
        return this.step(`fill ${selector} with "${value}"`, async () => {
            await this._page.fill(selector, value);
            await expect(this._page.locator(selector)).toHaveValue(value);
        });
    }

    protected async clear(fieldSelector: string): Promise<void> {
        await this.fill(fieldSelector, "");
    }

    public click(selector: string): Promise<void> {
        return this.step(`click ${selector}`, () => this._page.click(selector));
    }

    protected clickText(text: string, exact: boolean = true): Promise<void> {
        return this.step(`click text "${text}"`, () => this._page.getByText(text, { exact }).click());
    }

    protected clickButtonByText(text: string): Promise<void> {
        return this.step(`click button "${text}"`, () => this._page.getByRole("button", { name: text }).click());
    }

    protected selectOption(selector: string, value: string): Promise<void> {
        return this.step(`select option "${value}" on ${selector}`, async () => {
            await this._page.selectOption(selector, value);
        });
    }

    public pressKeyboard(...keys: Keyboard[]): Promise<void> {
        return this._page.keyboard.press(keys.map(key => `${key}`).join("+"));
    }

    // ------------------------------------------------------------------
    // Assertions
    // ------------------------------------------------------------------

    public expectVisible(selector: string, timeout: number = this.ELEMENT_TIMEOUT): Promise<void> {
        return this.step(`expect visible: ${selector}`, () =>
            expect(this._page.locator(selector)).toBeVisible({ timeout }));
    }

    public expectInvisible(selector: string, timeout: number = this.ELEMENT_TIMEOUT): Promise<void> {
        return this.step(`expect hidden: ${selector}`, () =>
            expect(this._page.locator(selector)).toBeHidden({ timeout }));
    }

    public expectEnabled(selector: string): Promise<void> {
        return this.step(`expect enabled: ${selector}`, () =>
            expect(this._page.locator(selector)).toBeEnabled());
    }

    public expectDisabled(selector: string): Promise<void> {
        return this.step(`expect disabled: ${selector}`, () =>
            expect(this._page.locator(selector)).toBeDisabled());
    }

    public expectTextVisible(text: string, exact: boolean = false, timeout: number = this.ELEMENT_TIMEOUT): Promise<void> {
        return this.step(`expect text visible: "${text}"`, () =>
            expect(this._page.getByText(text, { exact })).toBeVisible({ timeout }));
    }

    public expectTextInvisible(text: string, exact: boolean = false): Promise<void> {
        return this.step(`expect text hidden: "${text}"`, () =>
            expect(this._page.getByText(text, { exact })).toBeHidden());
    }

    public expectHasValue(selector: string, value: string): Promise<void> {
        return this.step(`expect ${selector} has value "${value}"`, () =>
            expect(this._page.locator(selector)).toHaveValue(value));
    }

    public expectEmpty(selector: string): Promise<void> {
        return this.expectHasValue(selector, "");
    }

    public async expectHasElement(...elements: Element[]): Promise<void> {
        for (const element of elements) await element.validate(this);
    }

    public expectHasButton(name: string, enabled: boolean = true): Promise<void> {
        const assertion = expect(this._page.getByRole("button", { name }));
        return enabled ? assertion.toBeEnabled() : assertion.toBeDisabled();
    }

    public expectHasButtonWithSelector(selector: string, text: string, enabled: boolean = true): Promise<void> {
        const assertion = expect(this._page.locator(selector, { hasText: text }));
        return enabled ? assertion.toBeEnabled() : assertion.toBeDisabled();
    }

    public expectHasOneElement(selector: string): Promise<void> {
        return this.step(`expect exactly one element: ${selector}`, () =>
            expect(this._page.locator(selector)).toHaveCount(1));
    }

    public async expectHasElements(selector: string): Promise<void> {
        await this.step(`expect one or more elements: ${selector}`, async () => {
            expect(await this._page.locator(selector).count()).toBeGreaterThanOrEqual(1);
        });
    }

    public expectHasEmptyElement(selector: string): Promise<void> {
        return this.step(`expect no element: ${selector}`, () =>
            expect(this._page.locator(selector)).toHaveCount(0));
    }

    // ------------------------------------------------------------------
    // State checks (non-asserting)
    // ------------------------------------------------------------------

    public async isVisible(selector: string, timeout: number = 2000): Promise<boolean> {
        try {
            await this._page.locator(selector).waitFor({ state: "visible", timeout });
            return true;
        } catch {
            return false;
        }
    }

    public isInvisible(selector: string): Promise<boolean> {
        return this._page.locator(selector).isHidden();
    }

    protected isEnabled(selector: string): Promise<boolean> {
        return this._page.locator(selector).isEnabled();
    }

    protected isChecked(selector: string): Promise<boolean> {
        return this._page.locator(selector).isChecked();
    }

    // ------------------------------------------------------------------
    // Waiting & reading
    // ------------------------------------------------------------------

    protected waitForUrl(urlOrPredicate: string, timeout: number = this.NAVIGATION_TIMEOUT): Promise<void> {
        return this.step(`wait for url: ${urlOrPredicate}`, () =>
            this._page.waitForURL(new RegExp("\\b" + urlOrPredicate + "\\b"), { timeout }));
    }

    public getInputValue(selector: string): Promise<string> {
        return this._page.locator(selector).inputValue();
    }

    public getTextValue(selector: string): Promise<string> {
        return this._page.locator(selector).innerText();
    }
}
