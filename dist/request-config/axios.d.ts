import { AxiosRequestConfig, AxiosInstance } from 'axios';
export declare enum Type {
    SUCCESS = "success",
    ERROR = "error"
}
declare const CreateAxios: (config?: AxiosRequestConfig, callBack?: ({ type: Type, msg: string }: {
    type: any;
    msg: any;
}) => any) => AxiosInstance;
export default CreateAxios;
