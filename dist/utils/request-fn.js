import { EventDispatch } from "./index";
export function to(promise, errorExt) {
    return promise
        .then((data) => [null, data])
        .catch((err) => {
        if (errorExt) {
            const parsedError = { ...err, ...errorExt };
            return [parsedError, undefined];
        }
        return [err, undefined];
    });
}
export function isPromise(val) {
    return Object(val).constructor === Promise;
}
export async function toCallback(promise, url) {
    const [err, res] = await to(promise);
    if (res?.code === 0) {
        EventDispatch.emit("request:success", res.data, url || "");
        return [null, res.data];
    }
    if (res?.code !== 0 || err) {
        EventDispatch.emit("request:error", res || err, url || "");
        if (isPromise(err)) {
            const e = await err.catch((e) => e);
            return [e, null];
        }
        return [res || err, null];
    }
    return [err, res.data];
}
//# sourceMappingURL=request-fn.js.map