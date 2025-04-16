import { toCallback } from "../utils/request-fn";
import { EventDispatch } from "../utils";
export default class Request {
    constructor(axios) {
        this.axios = axios;
    }
    get(url, data, config) {
        EventDispatch.emit("request", {
            url,
            data,
        });
        return toCallback(this.axios.get(url, Object.assign(Object.assign({}, config), { params: data })), url);
    }
    post(url, data, config) {
        EventDispatch.emit("request", {
            url,
            data,
        });
        return toCallback(this.axios.post(url, data, config), url);
    }
}
