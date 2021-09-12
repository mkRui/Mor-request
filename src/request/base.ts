import { AxiosRequestConfig, AxiosInstance } from 'axios'
import { BaseRequest } from '../types/base'

class Request {
    public axios: AxiosInstance

    constructor (axios: AxiosInstance) {
        this.axios = axios
    }

    public get<T> (url: string, config?: AxiosRequestConfig):Promise<BaseRequest.Response<T>> {
        return this.axios.get(url, config)
    }

    public post<T> (url: string, data, config?: AxiosRequestConfig):Promise<BaseRequest.Response<T>> {
        return this.axios.post(url, data, config)
    }
}
