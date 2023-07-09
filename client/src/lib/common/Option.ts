export default class Option<T> {
    readonly isNone: boolean;
    readonly some: T | undefined;

    constructor(isNone: boolean, some: T | undefined) {
        this.isNone = isNone;
        this.some = some;
    }

    static none<T>(): Option<T> {
        return new Option<T>(true, undefined);
    }

    static some<T>(some: T): Option<T> {
        return new Option<T>(false, some);
    }
}