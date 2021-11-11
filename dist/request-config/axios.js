/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-11-11 22:59:14
 */
import axios from 'axios';
import queryString from 'querystring';
export var Type;
(function (Type) {
    Type["SUCCESS"] = "success";
    Type["ERROR"] = "error";
})(Type || (Type = {}));
const CreateAxios = (config, callBack) => {
    const Axios = axios.create(Object.assign({ timeout: 5000 }, config));
    // request 拦截器
    Axios.interceptors.request.use((config) => {
        if (config.method === 'post' ||
            config.method === 'put' ||
            config.method === 'delete' ||
            config.method === 'patch') {
            if (!config.headers.requestPayload) {
                config.data = queryString.stringify(config.data);
            }
        }
        if (window.localStorage.getItem('token')) {
            config.headers['token'] = window.localStorage.getItem('token');
        }
        return config;
    }, err => {
        console.log(err);
        return Promise.reject(err);
    });
    // response 拦截器
    Axios.interceptors.response.use((response) => {
        var _a;
        let res = response.data;
        res.data = (_a = res.data) !== null && _a !== void 0 ? _a : {};
        if (res.code !== 0) {
            callBack && callBack({
                type: Type.ERROR,
                msg: res.msg
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
        const standardRes = {
            code: err.response.status,
            count: null,
            data: {},
            msg: err.message,
        };
        callBack && callBack({
            type: Type.ERROR,
            msg: err.message
        });
        return Promise.resolve(standardRes);
    });
    return Axios;
};
export default CreateAxios;
