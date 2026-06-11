import BasePage from "../base-page";
import BaseUrl from "../base-url";
import BaseConfigs from "../base-configs";

export default class Element {
    selector: string | null;
    value: string | null;
    type: ElementType;
    enabled: boolean = true;

    private constructor(selector: string | null, value: string | null, type: ElementType) {
        this.selector = selector;
        this.value = value;
        this.type = type;
    }

    public static of(selector: string, value: string): Element {
        return new Element(selector, value, ElementType.KEY_VALUE);
    }

    static ofSelector(selector: string): Element {
        return new Element(selector, null, ElementType.ELEMENT);
    }

    static ofText(text: string): Element {
        return new Element(null, text, ElementType.TEXT);
    }

    static ofButton(text: string, enabled: boolean = true): Element {
        const e = new Element(null, text, ElementType.BUTTON);
        e.enabled = enabled;
        return e;
    }

    static ofButtonWithSelector(selector: string, text: string, enabled: boolean = true): Element {
        const e = new Element(selector, text, ElementType.BUTTON_SELECTOR);
        e.enabled = enabled;
        return e;
    }

    static ofInput(selector: string, value: string, enabled: boolean = true): Element {
        const e = new Element(selector, value, ElementType.INPUT);
        e.enabled = enabled;
        return e;
    }

    public validate(page: BasePage<BaseUrl, BaseConfigs>): Promise<void> {
        switch (this.type) {
            case ElementType.TEXT:
                return page.expectTextVisible(this.value!);
            case ElementType.ELEMENT:
            case ElementType.INPUT:
                return page.expectVisible(this.selector!);
            case ElementType.KEY_VALUE:
                return page.expectHasValue(this.selector!, this.value!);
            case ElementType.BUTTON:
                return page.expectHasButton(this.value!, this.enabled);
            case ElementType.BUTTON_SELECTOR:
                return page.expectVisible(this.selector!)
                    .then(() => page.expectHasButtonWithSelector(this.selector!, this.value!, this.enabled));
            default:
                return Promise.resolve();
        }
    }
}

export enum ElementType {
    TEXT, ELEMENT, KEY_VALUE, BUTTON, BUTTON_SELECTOR, INPUT
}
