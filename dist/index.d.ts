export { BaseRequest } from './types/base';
import Request from './request/base';
declare const _default: {
    Request: typeof Request;
    CreateAxios: (config?: import("axios").AxiosRequestConfig) => import("axios").AxiosInstance;
};
export default _default;
