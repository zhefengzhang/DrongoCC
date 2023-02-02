import { Injector } from "../utils/Injector";
import { ITicker } from "./ITicker";
import { ITickerManager } from "./ITickerManager";
import { TickerManagerImpl } from "./TickerManagerImpl";

/**
 * 心跳管理器
 */
export class TickerManager {

    static KEY: string = "TickerManager";
    
    /**
     * 添加
     * @param value 
     */
    static addTicker(value: ITicker): void {
        this.impl.addTicker(value);
    }

    /**
     * 删除
     * @param value 
     */
    static removeTicker(value: ITicker): void {
        this.impl.removeTicker(value);
    }

    /**
     * 下一帧回调
     * @param value 
     */
    static callNextFrame(value: Function, caller: any): void {
        this.impl.callNextFrame(value, caller);
    }

    static clearNextFrame(value: Function, caller: any): void {
        this.impl.clearNextFrame(value, caller);
    }

    private static __impl: ITickerManager;
    static get impl(): ITickerManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl=new TickerManagerImpl();
        }
        return this.__impl;
    }
}