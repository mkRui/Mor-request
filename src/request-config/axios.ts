/*
 * @Author: mkRui
 * @Date: 2021-09-07 11:26:55
 * @LastEditTime: 2021-10-21 16:49:00
 */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import queryString from 'querystring'

const CreateAxios = (config?: AxiosRequestConfig): AxiosInstance => {

    const Axios = axios.create({
        timeout: 5000,
        ...config
    });
    
    // request 拦截器
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
        if (config.method === 'post' ||
            config.method === 'put' ||
            config.method === 'delete' ||
            config.method === 'patch'
        ) {
            config.data = queryString.stringify(config.data);
        }
        if (window.localStorage.getItem('token')) {
            config.headers['token'] = window.localStorage.getItem('token');
          }
        return config;
    }, err => {
        console.log(err);
        return Promise.reject(err)
    });


    // response 拦截器
    Axios.interceptors.response.use((response: AxiosResponse) => {
        const res = response.data
        if (!res.data) {
            res.data = {}
        } 
        return res;
    }, (err: AxiosError) => {
        Promise.reject(err.response.status);
    });


    return Axios
}

export default CreateAxios
