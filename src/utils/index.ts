interface PromiseData {
  code: number;
  count: number;
  msg: string;
  data: any;
}

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
export async function toCallback(
  promise: Promise<any>,
  success: (arg0: PromiseData | undefined) => void,
  errorFn?: (arg0: Error | PromiseData | null | undefined | any) => void
) {
  const [err, data] = await to<PromiseData>(promise);
  data?.code === 0 && success?.(data);

  if (data?.code !== 0 || err) {
    if (isPromise(err)) {
      err.catch((e: any) => {
        errorFn?.(e);
      });
      return false;
    }
    errorFn?.(data || err);
  }
}
