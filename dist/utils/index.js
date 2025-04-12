var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function to(promise, errorExt) {
    return promise
        .then((data) => [null, data])
        .catch((err) => {
        if (errorExt) {
            const parsedError = Object.assign(Object.assign({}, err), errorExt);
            return [parsedError, undefined];
        }
        return [err, undefined];
    });
}
export function isPromise(val) {
    return Object(val).constructor === Promise;
}
export function toCallback(promise, success, errorFn) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, data] = yield to(promise);
        (data === null || data === void 0 ? void 0 : data.code) === 0 && (success === null || success === void 0 ? void 0 : success(data));
        if ((data === null || data === void 0 ? void 0 : data.code) !== 0 || err) {
            if (isPromise(err)) {
                err.catch((e) => {
                    errorFn === null || errorFn === void 0 ? void 0 : errorFn(e);
                });
                return false;
            }
            errorFn === null || errorFn === void 0 ? void 0 : errorFn(data || err);
        }
    });
}
