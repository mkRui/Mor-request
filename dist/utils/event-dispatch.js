class EventDispatch {
    constructor() {
        this.list = {};
    }
    on(event, fn) {
        (this.list[event] || (this.list[event] = [])).push(fn);
    }
    emit(...args) {
        var _a;
        const argu = args;
        const event = (_a = [].shift.call(args)) !== null && _a !== void 0 ? _a : "";
        const fns = [...(this.list[event] || [])];
        if (!fns.length) {
            return false;
        }
        fns.forEach((item) => {
            item.apply(this, argu);
        });
    }
    once(event, fn) {
        this.list[event] = [fn];
    }
    off(event, fn) {
        const fns = this.list[event];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        }
        else {
            let cb;
            for (let i = 0, cbLen = fns.length; i < cbLen; i++) {
                cb = fns[i];
                if (cb === fn) {
                    fns.splice(i, 1);
                    break;
                }
            }
        }
    }
}
export default EventDispatch;
