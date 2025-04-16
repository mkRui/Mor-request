import { BaseRequest } from "../types/base";
import { EventDispatch } from "./index";
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[any, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = { ...err, ...errorExt };
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
}
export function isPromise(val: any) {
  return Object(val).constructor === Promise;
}
export async function toCallback<T>(
  promise: Promise<any>,
  url?: string
): Promise<BaseRequest.Response<T>> {
  const [err, res] = await to<BaseRequest.Success<T>>(promise);
  if (res?.code === 0) {
    EventDispatch.emit("request:success", res.data, url || "");
    return [null, res.data];
  }

  if (res?.code !== 0 || err) {
    EventDispatch.emit("request:error", res || err, url || "");
    if (isPromise(err)) {
      const e = await err.catch((e: any) => e);
      return [e, null];
    }
    return [res || err, null];
  }

  return [err, res.data];
}
