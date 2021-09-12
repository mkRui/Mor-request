export declare namespace BaseRequest {
    /**
     * 0 成功
     * 1 失败
     * 2 未登录
     * 
     */
    type Code = 0 | 1 | 2

    interface Success<T> {
        code: 0,
        count?: number,
        msg: string,
        data: T
    }

    interface Error<T> {
        code: Code,
        count?: number,
        msg: string,
        data: T
    }

    export type Response<T> = Success<T> | Error<T>
}