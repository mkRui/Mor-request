import { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from "axios";
/**
 * 回调类型枚举
 */
export declare enum CallbackType {
    SUCCESS = "success",
    ERROR = "error"
}
/**
 * 拦截器回调配置类型
 */
export interface InterceptorCallbackConfig {
    /** 回调类型 */
    type: CallbackType;
    /** 消息内容 */
    msg: string;
    /** 状态码 */
    code: number;
    /** 原始响应数据 */
    response?: AxiosResponse;
    /** 原始错误对象 */
    error?: AxiosError;
}
/**
 * 请求拦截器回调函数类型
 */
export type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
/**
 * 响应拦截器回调函数类型
 */
export type ResponseInterceptor = (config: InterceptorCallbackConfig) => void | Promise<void>;
/**
 * Axios 配置选项
 */
export interface CreateAxiosOptions {
    /** 基础 Axios 配置 */
    config?: AxiosRequestConfig;
    /** 请求拦截器 */
    requestInterceptor?: RequestInterceptor;
    /** 响应拦截器 */
    responseInterceptor?: ResponseInterceptor;
    /** 是否自动序列化请求参数 */
    autoStringify?: boolean;
}
/**
 * 创建 Axios 实例
 * @param options 配置选项
 * @returns Axios 实例
 */
declare const CreateAxios: (options?: CreateAxiosOptions) => AxiosInstance;
export default CreateAxios;
//# sourceMappingURL=axios.d.ts.map