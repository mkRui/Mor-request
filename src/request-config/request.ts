/*
 * @Author: mkRui
 * @Date: 2021-09-07 18:24:58
 * @LastEditTime: 2021-10-17 15:35:10
 */
import { AxiosRequestConfig, AxiosInstance } from 'axios'
import { BaseRequest } from '../types/base'

export default class Request {
    public axios: AxiosInstance

    constructor (axios: AxiosInstance) {
        this.axios = axios
    }

    public get<T> (url: string, data: any, config?: AxiosRequestConfig):Promise<BaseRequest.Response<T>> {
        return this.axios.get(url, {
            data,
            ...config
        })
    }

    public post<T> (url: string, data, config?: AxiosRequestConfig):Promise<BaseRequest.Response<T>> {
        return this.axios.post(url, data, config)
    }
}
