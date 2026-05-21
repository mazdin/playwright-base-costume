export default class Logger {
    static log(message: string) {
        console.log(`[LOG] ${message}`);
    }

    static info(message: string) {
        console.log(`[INFO] ${message}`);
    }

    static warn(message: string) {
        console.warn(`[WARN] ${message}`);
    }

    static error(message: string) {
        console.error(`[ERROR] ${message}`);
    }
}
