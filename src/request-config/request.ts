/*
 * @Author: mkRui
 * @Date: 2021-09-07 18:24:58
 * @LastEditTime: 2024-08-28 Updated
 * @Description: 请求类封装
 */
import { AxiosRequestConfig, AxiosInstance } from "axios";
import { BaseRequest, HttpMethod } from "../types/base";
import { toCallback } from "../utils/request-fn";
import { EventDispatch } from "../utils";

/**
 * 请求类，提供统一的 HTTP 请求方法
 */
export default class Request {
  /** Axios 实例 */
  public readonly axios: AxiosInstance;

  /**
   * 构造函数
   * @param axios Axios 实例
   */
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 查询参数
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('GET', url, params);
    
    return toCallback<T>(
      this.axios.get(url, {
        ...config,
        params,
      }),
      url
    );
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('POST', url, data);
    
    return toCallback<T>(
      this.axios.post(url, data, config),
      url
    );
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('PUT', url, data);
    
    return toCallback<T>(
      this.axios.put(url, data, config),
      url
    );
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('DELETE', url, null);
    
    return toCallback<T>(
      this.axios.delete(url, config),
      url
    );
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('PATCH', url, data);
    
    return toCallback<T>(
      this.axios.patch(url, data, config),
      url
    );
  }

  /**
   * HEAD 请求
   * @param url 请求地址
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async head<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('HEAD', url, null);
    
    return toCallback<T>(
      this.axios.head(url, config),
      url
    );
  }

  /**
   * OPTIONS 请求
   * @param url 请求地址
   * @param config Axios 配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async options<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    this.emitRequestEvent('OPTIONS', url, null);
    
    return toCallback<T>(
      this.axios.options(url, config),
      url
    );
  }

  /**
   * 发送请求事件
   * @param method HTTP 方法
   * @param url 请求地址
   * @param data 请求数据
   */
  private emitRequestEvent(method: HttpMethod, url: string, data: any): void {
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
  public async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    const { method = 'GET', url = '', data, params } = config;
    
    this.emitRequestEvent(method.toUpperCase() as HttpMethod, url, data || params);
    
    return toCallback<T>(
      this.axios.request(config),
      url
    );
  }

  /**
   * 上传文件
   * @param url 上传地址
   * @param file 文件数据
   * @param config 额外配置
   * @returns Promise<BaseRequest.Response<T>>
   */
  public async upload<T = any>(
    url: string,
    file: File | FormData,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    
    if (file instanceof File) {
      formData.append('file', file);
    }

    this.emitRequestEvent('POST', url, formData);
    
    return toCallback<T>(
      this.axios.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      }),
      url
    );
  }

  /**
   * 下载文件
   * @param url 下载地址
   * @param config 额外配置
   * @returns Promise<BaseRequest.Response<Blob>>
   */
  public async download(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<Blob>> {
    this.emitRequestEvent('GET', url, null);
    
    return toCallback<Blob>(
      this.axios.get(url, {
        ...config,
        responseType: 'blob',
      }),
      url
    );
  }
}
