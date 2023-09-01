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
} from "axios";

import queryString from "querystring";

export enum Type {
  SUCCESS = "success",
  ERROR = "error",
}

const CreateAxios = (
  config?: AxiosRequestConfig,
  callBack?: ({ type: Type, msg: string, code: number }) => any
): AxiosInstance => {
  const Axios = axios.create({
    timeout: 5000,
    ...config,
  });

  // request 拦截器
  Axios.interceptors.request.use(
    (rConfig: AxiosRequestConfig) => {
      const c = {};

      if (
        rConfig.method === "post" ||
        rConfig.method === "put" ||
        rConfig.method === "delete" ||
        rConfig.method === "patch"
      ) {
        if (!rConfig.headers.requestPayload) {
          rConfig.data = queryString.stringify(rConfig.data);
        }
      }

      Object.assign(c, config, rConfig)

      return c;
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
        callBack &&
          callBack({
            type: Type.ERROR,
            msg: res.msg,
            code: res.code,
          });
        res = {
          code: res.code,
          count: null,
          data: null,
          msg: res.msg,
        };
      }

      return Promise.resolve(res);
    },
    (err: AxiosError) => {
      const standardRes = {
        code: err.response?.status,
        count: null,
        data: {},
        msg: err.message,
      };
      callBack &&
        callBack({
          type: Type.ERROR,
          msg: err.message,
          code: err.response?.status,
        });
      return Promise.resolve(standardRes);
    }
  );

  return Axios;
};

export default CreateAxios;
