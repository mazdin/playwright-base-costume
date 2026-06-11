import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "playwright-report/**",
            "allure-report/**",
            "allure-results/**",
            "test-results/**",
            "junit-report/**",
            "dist/**",
            ".auth/**",
        ],
    },
    ...tseslint.configs.recommended,
    {
        ...playwright.configs["flat/recommended"],
        files: ["tests/**/*.ts"],
        rules: {
            ...playwright.configs["flat/recommended"].rules,
            // Assertion berada di page object (pola POM-scenario), bukan langsung di spec
            "playwright/expect-expect": "off",
        },
    },
);
