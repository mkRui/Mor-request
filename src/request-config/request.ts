/*
 * @Author: mkRui
 * @Date: 2021-09-07 18:24:58
 * @LastEditTime: 2021-10-23 17:02:33
 */
import { AxiosRequestConfig, AxiosInstance } from "axios";
import { BaseRequest } from "../types/base";
import { toCallback, to } from "../utils";

export default class Request {
  public axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public get<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<[any, undefined] | [null, T]> {
    return to(
      this.axios.get(url, {
        ...config,
        params: data,
      })
    );
  }

  public post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<[any, undefined] | [null, T]> {
    return to(this.axios.post(url, data, config));
  }
}
