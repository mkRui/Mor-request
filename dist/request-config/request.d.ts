import { AxiosRequestConfig, AxiosInstance } from "axios";
export default class Request {
    axios: AxiosInstance;
    constructor(axios: AxiosInstance);
    get<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<[any, undefined] | [null, T]>;
    post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<[any, undefined] | [null, T]>;
}
