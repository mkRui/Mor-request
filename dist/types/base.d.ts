export { AxiosInstance } from "axios";
export declare namespace BaseRequest {
    /**
     * 0 成功
     */
    interface Success<T> {
        code: 0;
        count: number;
        msg: string;
        data: T;
    }
    interface Error<T> {
        code: number;
        count: number;
        msg: string;
        data: T;
    }
    type Response<T> = [Error<T>, null] | [null, T];
}
