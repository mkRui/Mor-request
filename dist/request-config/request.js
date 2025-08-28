import { toCallback } from "../utils/request-fn";
import { EventDispatch } from "../utils";
/**
 * 请求类，提供统一的 HTTP 请求方法
 */
export default class Request {
    /**
     * 构造函数
     * @param axios Axios 实例
     */
    constructor(axios) {
        this.axios = axios;
    }
    /**
     * GET 请求
     * @param url 请求地址
     * @param params 查询参数
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async get(url, params, config) {
        this.emitRequestEvent('GET', url, params);
        return toCallback(this.axios.get(url, {
            ...config,
            params,
        }), url);
    }
    /**
     * POST 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async post(url, data, config) {
        this.emitRequestEvent('POST', url, data);
        return toCallback(this.axios.post(url, data, config), url);
    }
    /**
     * PUT 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async put(url, data, config) {
        this.emitRequestEvent('PUT', url, data);
        return toCallback(this.axios.put(url, data, config), url);
    }
    /**
     * DELETE 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async delete(url, config) {
        this.emitRequestEvent('DELETE', url, null);
        return toCallback(this.axios.delete(url, config), url);
    }
    /**
     * PATCH 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async patch(url, data, config) {
        this.emitRequestEvent('PATCH', url, data);
        return toCallback(this.axios.patch(url, data, config), url);
    }
    /**
     * HEAD 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async head(url, config) {
        this.emitRequestEvent('HEAD', url, null);
        return toCallback(this.axios.head(url, config), url);
    }
    /**
     * OPTIONS 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async options(url, config) {
        this.emitRequestEvent('OPTIONS', url, null);
        return toCallback(this.axios.options(url, config), url);
    }
    /**
     * 发送请求事件
     * @param method HTTP 方法
     * @param url 请求地址
     * @param data 请求数据
     */
    emitRequestEvent(method, url, data) {
        EventDispatch.emit('request', {
            method,
            url,
            data,
            timestamp: Date.now(),
        });
    }
    /**
     * 通用请求方法
     * @param config 完整的 Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async request(config) {
        const { method = 'GET', url = '', data, params } = config;
        this.emitRequestEvent(method.toUpperCase(), url, data || params);
        return toCallback(this.axios.request(config), url);
    }
    /**
     * 上传文件
     * @param url 上传地址
     * @param file 文件数据
     * @param config 额外配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    async upload(url, file, config) {
        const formData = file instanceof FormData ? file : new FormData();
        if (file instanceof File) {
            formData.append('file', file);
        }
        this.emitRequestEvent('POST', url, formData);
        return toCallback(this.axios.post(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        }), url);
    }
    /**
     * 下载文件
     * @param url 下载地址
     * @param config 额外配置
     * @returns Promise<BaseRequest.Response<Blob>>
     */
    async download(url, config) {
        this.emitRequestEvent('GET', url, null);
        return toCallback(this.axios.get(url, {
            ...config,
            responseType: 'blob',
        }), url);
    }
}
//# sourceMappingURL=request.js.map