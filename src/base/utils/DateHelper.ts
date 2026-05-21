export default class DateHelper {
    static today(): string {
        return new Date().toISOString().split("T")[0];
    }

    static format(date: Date, locale: string = "en-GB"): string {
        return date.toLocaleDateString(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static subtractDays(date: Date, days: number): Date {
        return DateHelper.addDays(date, -days);
    }
}
