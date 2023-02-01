export declare class Debuger {
    /**
     * 最大保存条数
     */
    static MaxCount: number;
    private static __logs;
    private static __debuger;
    /**
     * 设置过滤
     * @param key
     * @param isOpen
     */
    static debug(key: string, isOpen: boolean): void;
    /**
     * 获取已保存的日志
     * @param type
     * @returns
     */
    static getLogs(type?: string): Array<string>;
    private static __save;
    static log(type: string, msg: any): void;
    static err(type: string, msg: any): void;
    static warn(type: string, msg: any): void;
    static info(type: string, msg: any): void;
}
