/**
 * 事件类型定义
 */
type EventListener<T = any> = (...args: T[]) => void;

/**
 * 事件监听器列表类型
 */
interface EventListenerList {
  [eventName: string]: EventListener[];
}

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
  
  // 添加索引签名以满足泛型约束
  [key: string]: EventListener;
}

/**
 * 事件调度器类
 * 提供事件的注册、触发、移除等功能
 */
class EventDispatch<T extends Record<string, EventListener> = RequestEvents> {
  /** 事件监听器列表 */
  private readonly eventListeners: EventListenerList = {};
  
  /** 一次性事件监听器列表 */
  private readonly onceListeners: Set<EventListener> = new Set();

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   */
  public on<K extends keyof T>(event: K, listener: T[K]): void {
    const eventName = event as string;
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(listener as EventListener);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns 是否有监听器被执行
   */
  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean {
    const eventName = event as string;
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
          this.off(event, listener as T[K]);
          this.onceListeners.delete(listener);
        }
      } catch (error) {
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
  public once<K extends keyof T>(event: K, listener: T[K]): void {
    this.onceListeners.add(listener as EventListener);
    this.on(event, listener);
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 要移除的监听器函数，如果不提供则移除所有监听器
   * @returns 是否成功移除
   */
  public off<K extends keyof T>(event: K, listener?: T[K]): boolean {
    const eventName = event as string;
    const listeners = this.eventListeners[eventName];
    
    if (!listeners) {
      return false;
    }
    
    if (!listener) {
      // 移除所有监听器
      delete this.eventListeners[eventName];
      return true;
    }
    
    const index = listeners.indexOf(listener as EventListener);
    if (index > -1) {
      listeners.splice(index, 1);
      this.onceListeners.delete(listener as EventListener);
      
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
  public removeAllListeners(): void {
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
  public listenerCount<K extends keyof T>(event: K): number {
    const eventName = event as string;
    return this.eventListeners[eventName]?.length || 0;
  }
  
  /**
   * 获取所有事件名称
   * @returns 事件名称数组
   */
  public eventNames(): (keyof T)[] {
    return Object.keys(this.eventListeners) as (keyof T)[];
  }
  
  /**
   * 获取指定事件的所有监听器
   * @param event 事件名称
   * @returns 监听器数组
   */
  public getListeners<K extends keyof T>(event: K): T[K][] {
    const eventName = event as string;
    return (this.eventListeners[eventName] || []) as T[K][];
  }
}

export default EventDispatch;
