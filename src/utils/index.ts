import { BaseRequest } from "../types/base";

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
  promise: Promise<any>
): Promise<BaseRequest.Response<T>> {
  const [err, res] = await to<BaseRequest.Success<T>>(promise);
  if (res?.code === 0) return [null, res.data];

  if (res?.code !== 0 || err) {
    if (isPromise(err)) {
      const e = await err.catch((e: any) => e);
      return [e, null];
    }
    return [res || err, null];
  }

  return [err, res.data];
}
