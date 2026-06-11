export interface UserCredentials {
    username: string;
    password: string;
}

/**
 * Kredensial user SauceDemo. User utama bisa dioverride lewat .env
 * (USEREMAIL / PASSWORD); sisanya adalah user publik bawaan SauceDemo.
 */
export const USERS = {
    standard: {
        username: process.env.USEREMAIL ?? "standard_user",
        password: process.env.PASSWORD ?? "secret_sauce",
    },
    lockedOut: {
        username: "locked_out_user",
        password: "secret_sauce",
    },
} satisfies Record<string, UserCredentials>;

export const INVALID_PASSWORD = "wrong_pass";
export const UPPERCASE_PASSWORD = "SECRET_SAUCE";
