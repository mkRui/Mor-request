/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-10-10 14:22:19
 */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';


const CreateAxios = (config?: AxiosRequestConfig): AxiosInstance => {

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
        Promise.reject(err.response.status);
    });


    return Axios
}

export default CreateAxios
