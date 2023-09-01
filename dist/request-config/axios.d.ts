import { AxiosRequestConfig, AxiosInstance } from "axios";
export declare enum Type {
    SUCCESS = "success",
    ERROR = "error"
}
export interface ConfigTypes {
    type: Type;
    msg: string;
    code: number;
}
declare const CreateAxios: (config?: AxiosRequestConfig, reqCallBack?: (config: AxiosRequestConfig) => AxiosRequestConfig, resCallBack?: ({ type, msg, code }: ConfigTypes) => any) => AxiosInstance;
export default CreateAxios;
