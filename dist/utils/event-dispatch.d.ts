/**
 * 事件类型定义
 */
type EventListener<T = any> = (...args: T[]) => void;
/**
 * 预定义事件类型
 */
export interface RequestEvents {
    /** 请求开始事件 */
    'request': (data: {
        method: string;
        url: string;
        data: any;
        timestamp: number;
    }) => void;
    /** 请求成功事件 */
    'request:success': (data: any, url: string) => void;
    /** 请求失败事件 */
    'request:error': (error: any, url: string) => void;
    /** 加载状态变化事件 */
    'loading:change': (loading: boolean) => void;
    [key: string]: EventListener;
}
/**
 * 事件调度器类
 * 提供事件的注册、触发、移除等功能
 */
declare class EventDispatch<T extends Record<string, EventListener> = RequestEvents> {
    /** 事件监听器列表 */
    private readonly eventListeners;
    /** 一次性事件监听器列表 */
    private readonly onceListeners;
    /**
     * 注册事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     */
    on<K extends keyof T>(event: K, listener: T[K]): void;
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     * @returns 是否有监听器被执行
     */
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
    /**
     * 注册一次性事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     */
    once<K extends keyof T>(event: K, listener: T[K]): void;
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 要移除的监听器函数，如果不提供则移除所有监听器
     * @returns 是否成功移除
     */
    off<K extends keyof T>(event: K, listener?: T[K]): boolean;
    /**
     * 移除所有事件监听器
     */
    removeAllListeners(): void;
    /**
     * 获取指定事件的监听器数量
     * @param event 事件名称
     * @returns 监听器数量
     */
    listenerCount<K extends keyof T>(event: K): number;
    /**
     * 获取所有事件名称
     * @returns 事件名称数组
     */
    eventNames(): (keyof T)[];
    /**
     * 获取指定事件的所有监听器
     * @param event 事件名称
     * @returns 监听器数组
     */
    getListeners<K extends keyof T>(event: K): T[K][];
}
export default EventDispatch;
//# sourceMappingURL=event-dispatch.d.ts.map