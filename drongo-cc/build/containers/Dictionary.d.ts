import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 字典
 */
export declare class Dictionary<TKey, TValue> extends EventDispatcher {
    private __map;
    private __dataChanged;
    private __cacheElements;
    constructor();
    set(key: TKey, value: TValue): void;
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    has(key: TKey): boolean;
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    get(key: TKey): TValue | undefined;
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    delete(key: TKey): TValue | undefined;
    /**
     * 清除所有元素
     */
    clear(): void;
    /**
    * 元素列表
    */
    get elements(): Array<TValue>;
    /**
     * key列表
     */
    get keys(): Array<TKey>;
    get size(): number;
    destroy(): void;
}
