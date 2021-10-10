/*
 * @Author: mkRui
 * @Date: 2021-10-10 15:41:04
 * @LastEditTime: 2021-10-10 15:45:25
 */
import Request from './request'

export default class Store<T extends Request> {
    public api: T;
    public constructor(request: T) {
        this.api = request;
        Object.defineProperty(this, 'api', {
            enumerable: false
        });
    }
}