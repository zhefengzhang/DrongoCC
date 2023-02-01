import { ITicker } from "./ITicker";
import { ITickManager } from "./ITickManager";
/**
 * 心跳管理器
 */
export declare class TickManager {
    static KEY: string;
    /**
     * 添加
     * @param value
     */
    static addTicker(value: ITicker): void;
    /**
     * 删除
     * @param value
     */
    static removeTicker(value: ITicker): void;
    /**
     * 下一帧回调
     * @param value
     */
    static callNextFrame(value: Function, caller: any): void;
    static clearNextFrame(value: Function, caller: any): void;
    private static __impl;
    static get impl(): ITickManager;
}
