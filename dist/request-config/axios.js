/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-10-21 17:14:07
 */
import axios from 'axios';
import queryString from 'querystring';
const CreateAxios = (config) => {
    const Axios = axios.create(Object.assign({ timeout: 5000 }, config));
    // request 拦截器
    Axios.interceptors.request.use((config) => {
        if (config.method === 'post' ||
            config.method === 'put' ||
            config.method === 'delete' ||
            config.method === 'patch') {
            config.data = queryString.stringify(config.data);
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
        const res = response.data;
        if (!res.data) {
            res.data = {};
        }
        if (res.data.code !== 0) {
            throw Promise.reject({
                code: res.code,
                count: null,
                data: null,
                msg: res.msg,
            });
        }
        return res;
    }, (err) => {
        const standardRes = {
            code: err.response.status,
            count: null,
            data: {},
            msg: err.message,
        };
        Promise.reject(standardRes);
    });
    return Axios;
};
export default CreateAxios;
