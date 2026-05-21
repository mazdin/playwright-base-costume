import BasePage from "../base-page";

export default class Element {
    selector?: string;
    value?: string;
    type: ElementType;
    enabled: boolean;

    private constructor(selector: string, value: string, type: ElementType) {
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

    static ofLink(text: string): Element {
        return new Element(null, text, ElementType.LINK);
    }

    static ofButton(text: string, enabled: boolean = true) {
        let e = new Element(null, text, ElementType.BUTTON);
        e.enabled = enabled;
        return e;
    }

    static ofButtonWithSelector(selector: string, text: string, enabled: boolean = true) {
        let e = new Element(selector, text, ElementType.BUTTON_SELECTOR);
        e.enabled = enabled;
        return e;
    }

    static ofInput(selector: string, text: string, enabled: boolean = true): Element {
        let e = new Element(selector, text, ElementType.INPUT);
        e.enabled = enabled;
        return e;
    }

    public validate(page: BasePage<any, any>): Promise<void> {
        switch (this.type) {
            case ElementType.TEXT:
                return page.expectTextVisible(this.value);
            case ElementType.ELEMENT:
                return page.expectVisible(this.selector);
            case ElementType.KEY_VALUE:
                return page.expectHasValue(this.selector, this.value);
            case ElementType.BUTTON:
                return page.expectHasButton(this.selector, this.value, this.enabled);
            case ElementType.BUTTON_SELECTOR:
                return page.expectVisible(this.selector)
                    .then(_ => page.expectHasButtonWithID(this.selector, this.value, this.enabled));
            case ElementType.INPUT:
                return page.expectVisible(this.selector);
            case ElementType.LINK:
            default:
                return new Promise<void>(resolve => resolve());
        }
    }
}

export enum ElementType {
    TEXT, ELEMENT, KEY_VALUE, LINK, BUTTON, BUTTON_SELECTOR, INPUT
}
