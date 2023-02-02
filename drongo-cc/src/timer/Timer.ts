import { Injector } from "../utils/Injector";
import { ITimer } from "./ITimer";
import { TimerImpl } from "./TimerImpl";


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
     * @param time  时间起点，如果不设置则获取系统当前时间点
     */
    static reset(time?: number): void {
        this.impl.reset(time);
    }

    private static __impl: ITimer;
    private static get impl(): ITimer {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new TimerImpl();
        }
        return this.__impl;
    }
}