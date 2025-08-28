import { AxiosRequestConfig, AxiosInstance } from "axios";
import { BaseRequest } from "../types/base";
/**
 * 请求类，提供统一的 HTTP 请求方法
 */
export default class Request {
    /** Axios 实例 */
    readonly axios: AxiosInstance;
    /**
     * 构造函数
     * @param axios Axios 实例
     */
    constructor(axios: AxiosInstance);
    /**
     * GET 请求
     * @param url 请求地址
     * @param params 查询参数
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * POST 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * PUT 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * DELETE 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * PATCH 请求
     * @param url 请求地址
     * @param data 请求数据
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * HEAD 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * OPTIONS 请求
     * @param url 请求地址
     * @param config Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * 发送请求事件
     * @param method HTTP 方法
     * @param url 请求地址
     * @param data 请求数据
     */
    private emitRequestEvent;
    /**
     * 通用请求方法
     * @param config 完整的 Axios 配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    request<T = any>(config: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * 上传文件
     * @param url 上传地址
     * @param file 文件数据
     * @param config 额外配置
     * @returns Promise<BaseRequest.Response<T>>
     */
    upload<T = any>(url: string, file: File | FormData, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    /**
     * 下载文件
     * @param url 下载地址
     * @param config 额外配置
     * @returns Promise<BaseRequest.Response<Blob>>
     */
    download(url: string, config?: AxiosRequestConfig): Promise<BaseRequest.Response<Blob>>;
}
//# sourceMappingURL=request.d.ts.map