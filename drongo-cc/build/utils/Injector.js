/**
 * 注入器
 */
export class Injector {
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static inject(customKey, clazz) {
        if (clazz instanceof Function) {
            this.__injectedMap.set(customKey, clazz);
        }
        else {
            this.__instanceMap.set(customKey, clazz);
        }
    }
    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey) {
        let instance = this.__instanceMap.get(customKey);
        if (instance) {
            return instance;
        }
        let clazz = this.__injectedMap.get(customKey);
        if (clazz === undefined) {
            return null;
        }
        instance = new clazz();
        this.__instanceMap.set(customKey, instance);
        return instance;
    }
}
/**类型字典*/
Injector.__injectedMap = new Map();
/**实例字典*/
Injector.__instanceMap = new Map();
