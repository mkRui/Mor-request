import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { BaseRequest } from '../types/base';
export default class Request {
    axios: AxiosInstance;
    constructor(axios: AxiosInstance);
    get<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
    post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<BaseRequest.Response<T>>;
}
