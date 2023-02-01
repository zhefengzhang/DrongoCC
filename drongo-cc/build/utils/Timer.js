import { Injector } from "./Injector";
/**
 * 时间工具类
 */
export class Timer {
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime() {
        return this.impl.currentTime;
    }
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime() {
        return this.impl.absTime;
    }
    /**
     * 重新校准
     */
    static reset() {
        this.impl.reset();
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}
Timer.KEY = "Timer";
