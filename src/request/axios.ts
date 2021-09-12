import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';


export const CreateAxios = (config?: AxiosRequestConfig): AxiosInstance => {

    const Axios = axios.create({
        timeout: 5000,
        ...config
    });
    
    // request 拦截器
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
        return config;
    }, err => {
        console.log(err);
    });


    // response 拦截器
    Axios.interceptors.response.use((response: AxiosResponse) => {
        return response;
    }, (err: AxiosError) => {
        return Promise.reject(err.response.status);
    });


    return Axios
}
