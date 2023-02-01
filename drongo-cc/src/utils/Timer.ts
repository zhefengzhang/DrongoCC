import { Injector } from "./Injector";

export interface ITimer{
    /**
     * 当前时间(推荐使用)
     */
    readonly currentTime: number;
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    readonly absTime: number;
    /**
     * 重新校准
     */
    reset(): void;
}

/**
 * 时间工具类
 */
export class Timer {

    static KEY: string = "Timer";
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime(): number {
        return this.impl.currentTime;
    }
    
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime(): number {
        return this.impl.absTime;
    }

    /**
     * 重新校准
     */
    static reset(): void {
        this.impl.reset();
    }

    private static __impl: ITimer;
    private static get impl(): ITimer {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}