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
    problem: {
        username: "problem_user",
        password: "secret_sauce",
    },
    performanceGlitch: {
        username: "performance_glitch_user",
        password: "secret_sauce",
    },
    error: {
        username: "error_user",
        password: "secret_sauce",
    },
    visual: {
        username: "visual_user",
        password: "secret_sauce",
    },
} satisfies Record<string, UserCredentials>;

/**
 * User SauceDemo yang seharusnya tetap bisa login & mencapai inventory
 * (dipakai untuk data-driven login smoke). locked_out_user sengaja dikecualikan.
 */
export const LOGINABLE_USERS: UserCredentials[] = [
    USERS.standard,
    USERS.problem,
    USERS.performanceGlitch,
    USERS.error,
    USERS.visual,
];

export const INVALID_PASSWORD = "wrong_pass";
export const UPPERCASE_PASSWORD = "SECRET_SAUCE";
