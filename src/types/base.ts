/*
 * @Author: mkRui
 * @Date: 2021-09-06 21:42:28
 * @LastEditTime: 2021-10-24 08:55:08
 */
export { AxiosInstance } from "axios";
export declare namespace BaseRequest {
  /**
   * 0 成功
   */
  export interface Success<T> {
    code: 0;
    count: number;
    msg: string;
    data: T;
  }

  export interface Error<T> {
    code: number;
    count: number;
    msg: string;
    data: T;
  }

  export type Response<T> = [Error<T>, null] | [null, T];
}
