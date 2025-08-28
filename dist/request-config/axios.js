/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2024-08-28 Updated
 * @Description: Axios 配置和拦截器
 */
import axios from "axios";
import queryString from "querystring";
import { HttpStatusCode } from "../types/base";
/**
 * 回调类型枚举
 */
export var CallbackType;
(function (CallbackType) {
    CallbackType["SUCCESS"] = "success";
    CallbackType["ERROR"] = "error";
})(CallbackType || (CallbackType = {}));
/**
 * 创建 Axios 实例
 * @param options 配置选项
 * @returns Axios 实例
 */
const CreateAxios = (options = {}) => {
    const { config = {}, requestInterceptor, responseInterceptor, autoStringify = true } = options;
    // 创建 Axios 实例
    const axiosInstance = axios.create({
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        ...config,
    });
    // 请求拦截器
    axiosInstance.interceptors.request.use(async (requestConfig) => {
        try {
            // 处理请求参数序列化
            if (autoStringify && shouldStringifyData(requestConfig)) {
                requestConfig.data = queryString.stringify(requestConfig.data);
                // 修改 Content-Type
                if (requestConfig.headers) {
                    requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            }
            // 调用自定义请求拦截器
            if (requestInterceptor) {
                const modifiedConfig = await requestInterceptor(requestConfig);
                return { ...requestConfig, ...modifiedConfig };
            }
            return requestConfig;
        }
        catch (error) {
            console.error('请求拦截器错误:', error);
            return Promise.reject(error);
        }
    }, (error) => {
        console.error('请求配置错误:', error);
        return Promise.reject(error);
    });
    // 响应拦截器
    axiosInstance.interceptors.response.use(async (response) => {
        try {
            const responseData = response.data;
            // 标准化响应数据格式
            const standardResponse = {
                code: responseData?.code ?? HttpStatusCode.SUCCESS,
                count: responseData?.count ?? 0,
                msg: responseData?.msg ?? '请求成功',
                data: responseData?.data ?? responseData,
            };
            // 判断是否成功
            const isSuccess = standardResponse.code === HttpStatusCode.SUCCESS;
            // 调用响应拦截器
            if (responseInterceptor) {
                await responseInterceptor({
                    type: isSuccess ? CallbackType.SUCCESS : CallbackType.ERROR,
                    msg: standardResponse.msg,
                    code: standardResponse.code,
                    response,
                });
            }
            // 返回标准化响应
            return Promise.resolve(standardResponse);
        }
        catch (error) {
            console.error('响应处理错误:', error);
            return Promise.reject(error);
        }
    }, async (error) => {
        // 构建标准错误响应
        const standardErrorResponse = {
            code: error.response?.status ?? HttpStatusCode.INTERNAL_SERVER_ERROR,
            count: null,
            data: error.response?.data || null,
            msg: getErrorMessage(error),
        };
        // 调用响应拦截器
        if (responseInterceptor) {
            try {
                await responseInterceptor({
                    type: CallbackType.ERROR,
                    msg: standardErrorResponse.msg,
                    code: standardErrorResponse.code,
                    error,
                });
            }
            catch (interceptorError) {
                console.error('响应拦截器错误:', interceptorError);
            }
        }
        return Promise.resolve(standardErrorResponse);
    });
    return axiosInstance;
};
/**
 * 判断是否需要序列化请求数据
 */
function shouldStringifyData(config) {
    const method = config.method?.toLowerCase();
    const hasRequestPayload = config.headers?.requestPayload;
    return (!hasRequestPayload &&
        config.data &&
        typeof config.data === 'object' &&
        (method === 'post' || method === 'put' || method === 'delete' || method === 'patch'));
}
/**
 * 获取错误信息
 */
function getErrorMessage(error) {
    if (error.response) {
        // 服务器响应错误
        const status = error.response.status;
        const statusText = error.response.statusText;
        switch (status) {
            case HttpStatusCode.BAD_REQUEST:
                return '请求参数错误';
            case HttpStatusCode.UNAUTHORIZED:
                return '未授权，请登录';
            case HttpStatusCode.FORBIDDEN:
                return '拒绝访问';
            case HttpStatusCode.NOT_FOUND:
                return '请求的资源不存在';
            case HttpStatusCode.INTERNAL_SERVER_ERROR:
                return '服务器内部错误';
            default:
                return `请求失败: ${status} ${statusText}`;
        }
    }
    else if (error.request) {
        // 网络错误
        return '网络错误，请检查网络连接';
    }
    else {
        // 其他错误
        return error.message || '未知错误';
    }
}
export default CreateAxios;
//# sourceMappingURL=axios.js.map