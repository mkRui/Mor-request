/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-11-27 19:11:14
 */
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import queryString from "querystring";

export enum Type {
  SUCCESS = "success",
  ERROR = "error",
}

export interface ConfigTypes {
  type: Type;
  msg: string;
  code: number;
}

const CreateAxios = (
  config?: AxiosRequestConfig,
  reqCallBack?: (config: AxiosRequestConfig) => AxiosRequestConfig,
  resCallBack?: ({ type, msg, code }: ConfigTypes) => any
): AxiosInstance => {
  const Axios = axios.create({
    timeout: 5000,
    ...config,
  });

  // request 拦截器
  Axios.interceptors.request.use(
    (rConfig: AxiosRequestConfig) => {
      if (
        rConfig.method === "post" ||
        rConfig.method === "put" ||
        rConfig.method === "delete" ||
        rConfig.method === "patch"
      ) {
        if (!rConfig.headers?.requestPayload) {
          rConfig.data = queryString.stringify(rConfig.data);
        }
      }
      // 调用 reqCallBack 并将其结果合并到 rConfig
      const modifiedConfig = reqCallBack?.(rConfig);
      if (modifiedConfig) {
        Object.assign(rConfig, modifiedConfig);
      }

      // 返回 rConfig，确保类型正确
      return rConfig as InternalAxiosRequestConfig;
    },
    (err) => {
      console.log(err);
      return Promise.reject(err);
    }
  );

  // response 拦截器
  Axios.interceptors.response.use(
    (response: AxiosResponse) => {
      let res = response.data;

      res.data = res.data ?? "";

      if (res.code !== 0) {
        if (resCallBack) {
          resCallBack({
            type: Type.ERROR,
            msg: res.msg,
            code: res.code,
          });
        }
        Object.assign(res, {
          code: res.code,
          count: null,
          data: null,
          msg: res.msg,
        });
      }

      return Promise.resolve(res);
    },
    (err: AxiosError) => {
      const standardRes = {
        code: err.response?.status,
        count: null,
        data: null,
        msg: err.message,
      };
      if (resCallBack) {
        resCallBack({
          type: Type.ERROR,
          msg: err.message,
          code: err.response?.status || -1,
        });
      }
      return Promise.resolve(standardRes);
    }
  );

  return Axios;
};

export default CreateAxios;
