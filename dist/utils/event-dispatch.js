/**
 * 事件调度器类
 * 提供事件的注册、触发、移除等功能
 */
class EventDispatch {
    constructor() {
        /** 事件监听器列表 */
        this.eventListeners = {};
        /** 一次性事件监听器列表 */
        this.onceListeners = new Set();
    }
    /**
     * 注册事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     */
    on(event, listener) {
        const eventName = event;
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(listener);
    }
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     * @returns 是否有监听器被执行
     */
    emit(event, ...args) {
        const eventName = event;
        const listeners = this.eventListeners[eventName];
        if (!listeners || listeners.length === 0) {
            return false;
        }
        // 复制一份监听器列表，避免在执行过程中被修改
        const listenersToExecute = [...listeners];
        listenersToExecute.forEach((listener) => {
            try {
                listener(...args);
                // 如果是一次性监听器，执行后移除
                if (this.onceListeners.has(listener)) {
                    this.off(event, listener);
                    this.onceListeners.delete(listener);
                }
            }
            catch (error) {
                console.error(`事件 ${eventName} 的监听器执行失败:`, error);
            }
        });
        return true;
    }
    /**
     * 注册一次性事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     */
    once(event, listener) {
        this.onceListeners.add(listener);
        this.on(event, listener);
    }
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 要移除的监听器函数，如果不提供则移除所有监听器
     * @returns 是否成功移除
     */
    off(event, listener) {
        const eventName = event;
        const listeners = this.eventListeners[eventName];
        if (!listeners) {
            return false;
        }
        if (!listener) {
            // 移除所有监听器
            delete this.eventListeners[eventName];
            return true;
        }
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
            this.onceListeners.delete(listener);
            // 如果没有监听器了，删除整个事件
            if (listeners.length === 0) {
                delete this.eventListeners[eventName];
            }
            return true;
        }
        return false;
    }
    /**
     * 移除所有事件监听器
     */
    removeAllListeners() {
        Object.keys(this.eventListeners).forEach(event => {
            delete this.eventListeners[event];
        });
        this.onceListeners.clear();
    }
    /**
     * 获取指定事件的监听器数量
     * @param event 事件名称
     * @returns 监听器数量
     */
    listenerCount(event) {
        const eventName = event;
        return this.eventListeners[eventName]?.length || 0;
    }
    /**
     * 获取所有事件名称
     * @returns 事件名称数组
     */
    eventNames() {
        return Object.keys(this.eventListeners);
    }
    /**
     * 获取指定事件的所有监听器
     * @param event 事件名称
     * @returns 监听器数组
     */
    getListeners(event) {
        const eventName = event;
        return (this.eventListeners[eventName] || []);
    }
}
export default EventDispatch;
//# sourceMappingURL=event-dispatch.js.map