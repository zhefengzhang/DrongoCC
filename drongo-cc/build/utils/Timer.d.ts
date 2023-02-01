export interface ITimer {
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
export declare class Timer {
    static KEY: string;
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime(): number;
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime(): number;
    /**
     * 重新校准
     */
    static reset(): void;
    private static __impl;
    private static get impl();
}
