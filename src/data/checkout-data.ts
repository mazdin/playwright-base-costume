export interface CheckoutInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export const CHECKOUT_INFO = {
    valid: { firstName: "Ani", lastName: "Budi", postalCode: "12345" },
    whitespace: { firstName: "   ", lastName: "   ", postalCode: "   " },
} satisfies Record<string, CheckoutInfo>;

export const TAX_RATE = 0.08;
