import { BaseRequest } from "../types/base";
export declare function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[any, undefined] | [null, T]>;
export declare function isPromise(val: any): boolean;
export declare function toCallback<T>(promise: Promise<any>): Promise<BaseRequest.Response<T>>;
