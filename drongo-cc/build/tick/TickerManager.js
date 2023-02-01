import { Injector } from "../utils/Injector";
/**
 * 心跳管理器
 */
export class TickManager {
    /**
     * 添加
     * @param value
     */
    static addTicker(value) {
        this.impl.addTicker(value);
    }
    /**
     * 删除
     * @param value
     */
    static removeTicker(value) {
        this.impl.removeTicker(value);
    }
    /**
     * 下一帧回调
     * @param value
     */
    static callNextFrame(value, caller) {
        this.impl.callNextFrame(value, caller);
    }
    static clearNextFrame(value, caller) {
        this.impl.clearNextFrame(value, caller);
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + " 未注入!");
        }
        return this.__impl;
    }
}
TickManager.KEY = "TickManager";
