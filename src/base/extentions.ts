export {};

function capitalize(this: string): string {
    return this.split("")
        .map((char) => char.toUpperCase())
        .join("");
}

declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = capitalize;
