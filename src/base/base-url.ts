export default abstract class BaseUrl {
    public abstract baseUrl: () => string;

    public abstract get get(): object;

    public getCompleteUrl(path: string) {
        return `${this.baseUrl()}${path}`;
    }
}
