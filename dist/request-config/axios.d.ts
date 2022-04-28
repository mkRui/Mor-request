import { AxiosRequestConfig, AxiosInstance } from 'axios';
export declare enum Type {
    SUCCESS = "success",
    ERROR = "error"
}
declare const CreateAxios: (config?: AxiosRequestConfig, callBack?: ({ type: Type, msg: string, code: number }: {
    type: any;
    msg: any;
    code: any;
}) => any) => AxiosInstance;
export default CreateAxios;
