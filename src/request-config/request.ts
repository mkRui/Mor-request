/*
 * @Author: mkRui
 * @Date: 2021-09-07 18:24:58
 * @LastEditTime: 2021-10-23 17:02:33
 */
import { AxiosRequestConfig, AxiosInstance } from "axios";
import { BaseRequest } from "../types/base";
import { toCallback } from "../utils/request-fn";
import { EventDispatch } from "../utils";

export default class Request {
  public axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public get<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    EventDispatch.emit("request", {
      url,
      data,
    });
    return toCallback(
      this.axios.get(url, {
        ...config,
        params: data,
      }),
      url
    );
  }

  public post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<BaseRequest.Response<T>> {
    EventDispatch.emit("request", {
      url,
      data,
    });
    return toCallback(this.axios.post(url, data, config), url);
  }
}
