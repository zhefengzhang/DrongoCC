


/**
 * 注入器
 */
export class Injector {

    /**类型字典*/
    private static __injectedMap: Map<string, any> = new Map<string, any>();
    /**实例字典*/
    private static __instanceMap: Map<string, any> = new Map<string, any>();

    /**
     * 注入
     * @param key 
     * @param clazz   类型或实例
     */
    static inject(customKey: string, clazz: any): void {
        if (clazz instanceof Function) {
            this.__injectedMap.set(customKey, clazz);
        } else {
            this.__instanceMap.set(customKey, clazz);
        }
    }

    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey: string): any | null {
        let instance: any = this.__instanceMap.get(customKey);
        if (instance) {
            return instance;
        }
        let clazz: any | undefined = this.__injectedMap.get(customKey);
        if (clazz === undefined) {
            return null;
        }
        instance = new clazz();
        this.__instanceMap.set(customKey, instance);
        return instance;
    }
}