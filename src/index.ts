/*
 * @Author: mkRui
 * @Date: 2021-09-06 21:32:25
 * @LastEditTime: 2021-10-10 15:57:45
 */
export { BaseRequest, AxiosInstance as Config } from "./types/base";

import CreateAxios from "./request-config/axios";

import Request from "./request-config/request";

import Store from "./request-config/store";

export { to, toCallback } from "./utils";

export { Request, Store, CreateAxios };
