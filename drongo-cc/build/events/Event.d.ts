import { EventDispatcher } from "./EventDispatcher";
export declare class Event {
    static readonly START: string;
    static readonly PROGRESS: string;
    static readonly COMPLETE: string;
    static readonly ERROR: string;
    static readonly ADD: string;
    static readonly REMOVE: string;
    static readonly UPDATE: string;
    static readonly CLEAR: string;
    static readonly State_Changed: string;
    /**事件通道 */
    private static channels;
    /**
     * 获取事件通道
     * @param key
     * @returns
     */
    static getChannel(key?: string): EventDispatcher;
    /**
     * 派发事件
     * @param eventType
     * @param data
     * @param channel   通道
     */
    static emit(eventType: string, data?: any, channel?: string): void;
    /**
     * 添加事件监听
     * @param type
     * @param handler
     * @param caller
     * @param priority  优先级
     * @param channel   事件通道
     */
    static on(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority?: number, channel?: string): void;
    /**
     * 删除事件监听
     * @param type
     * @param handler
     * @param caller
     * @param channel
     * @returns
     */
    static off(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, channel?: string): void;
    /**
     * 删除指定对象上的所有事件监听
     * @param caller
     * @param channel
     * @returns
     */
    static offByCaller(caller: any, channel?: string): void;
    /**
     * 删除指定通道上的所有事件监听
     * @param channel
     * @returns
     */
    static offAll(channel?: string): void;
}
