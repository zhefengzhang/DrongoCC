import { IEventDispatcher } from "./IEventDispatcher";
/**
 * 事件分发器(只有一对多的情况下去使用)
 */
export declare class EventDispatcher implements IEventDispatcher {
    /**
    * 对象已经注册的处理器
    */
    private callerMap;
    /**
     * 事件派发器上所监听的处理器
     */
    private keyMap;
    constructor();
    /**
     * 添加事件
     * @param key
     * @param caller
     * @param func
     * @param priority 优先级（数字越小优先级越高）
     */
    on(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    off(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): void;
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    offByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    offAllEvent(): void;
    /**
     * 派发事件
     * @param key
     * @param data
     */
    emit(key: string, data?: any): void;
    /**
     * 是否有事件监听
     * @param key
     */
    hasEvent(key: string): boolean;
    /**
     * 是否包含指定函数事件监听
     * @param key
     * @param caller
     * @param func
     */
    hasEventHandler(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): boolean;
    destroy(): void;
}
