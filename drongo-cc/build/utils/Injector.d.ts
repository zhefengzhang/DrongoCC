/**
 * 注入器
 */
export declare class Injector {
    /**类型字典*/
    private static __injectedMap;
    /**实例字典*/
    private static __instanceMap;
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static inject(customKey: string, clazz: any): void;
    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey: string): any | null;
}
