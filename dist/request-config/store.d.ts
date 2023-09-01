import Request from "./request";
export default class Store<T extends Request> {
    api: T;
    constructor(request: T);
}
