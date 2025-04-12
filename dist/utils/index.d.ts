interface PromiseData {
    code: number;
    count: number;
    msg: string;
    data: any;
}
export declare function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[any, undefined] | [null, T]>;
export declare function isPromise(val: any): boolean;
export declare function toCallback(promise: Promise<any>, success: (arg0: PromiseData | undefined) => void, errorFn?: (arg0: Error | PromiseData | null | undefined | any) => void): Promise<boolean>;
export {};
