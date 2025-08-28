export default class Store {
    constructor(request) {
        this.api = request;
        Object.defineProperty(this, "api", {
            enumerable: false,
        });
    }
}
//# sourceMappingURL=store.js.map