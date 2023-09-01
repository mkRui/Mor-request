/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-11-27 19:11:14
 */
import axios from "axios";
import queryString from "querystring";
export var Type;
(function (Type) {
    Type["SUCCESS"] = "success";
    Type["ERROR"] = "error";
})(Type || (Type = {}));
const CreateAxios = (config, callBack) => {
    const Axios = axios.create(Object.assign({ timeout: 5000 }, config));
    // request 拦截器
    Axios.interceptors.request.use((rConfig) => {
        const c = {};
        if (rConfig.method === "post" ||
            rConfig.method === "put" ||
            rConfig.method === "delete" ||
            rConfig.method === "patch") {
            if (!rConfig.headers.requestPayload) {
                rConfig.data = queryString.stringify(rConfig.data);
            }
        }
        Object.assign(c, config, rConfig);
        return c;
    }, (err) => {
        console.log(err);
        return Promise.reject(err);
    });
    // response 拦截器
    Axios.interceptors.response.use((response) => {
        var _a;
        let res = response.data;
        res.data = (_a = res.data) !== null && _a !== void 0 ? _a : "";
        if (res.code !== 0) {
            callBack &&
                callBack({
                    type: Type.ERROR,
                    msg: res.msg,
                    code: res.code,
                });
            res = {
                code: res.code,
                count: null,
                data: null,
                msg: res.msg,
            };
        }
        return Promise.resolve(res);
    }, (err) => {
        var _a, _b;
        const standardRes = {
            code: (_a = err.response) === null || _a === void 0 ? void 0 : _a.status,
            count: null,
            data: {},
            msg: err.message,
        };
        callBack &&
            callBack({
                type: Type.ERROR,
                msg: err.message,
                code: (_b = err.response) === null || _b === void 0 ? void 0 : _b.status,
            });
        return Promise.resolve(standardRes);
    });
    return Axios;
};
export default CreateAxios;
