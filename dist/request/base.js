export default class Request {
    constructor(axios) {
        this.axios = axios;
    }
    get(url, config) {
        return this.axios.get(url, config);
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
}
