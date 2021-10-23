export default class Request {
    constructor(axios) {
        this.axios = axios;
    }
    get(url, data, config) {
        return this.axios.get(url, Object.assign(Object.assign({}, config), { params: data }));
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
}
