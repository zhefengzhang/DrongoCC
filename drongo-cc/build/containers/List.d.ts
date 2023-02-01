import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 列表
 */
export declare class List<T> extends EventDispatcher {
    private __element;
    /**
     * 是否保证元素的唯一性
     */
    private __only;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    count: number;
    constructor(only?: boolean);
    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     */
    push(value: T): boolean;
    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     * @returns
     */
    unshift(value: T): boolean;
    /**
     * 获取并删除最后一个元素
     * @returns
     */
    pop(): T;
    /**
     * 获取并删除第一个元素
     * @returns
     */
    shift(): T;
    /**
     * 删除指定索引的元素
     * @param index
     */
    removeAt(index: number): T;
    /**
     * 删除元素
     * @param value
     */
    remove(value: T): void;
    /**
     * 移除所有元素
     */
    clear(): void;
    /**
     * 判断是否包含
     * @param value
     * @returns
     */
    has(value: T): boolean;
    /**
     * 查找元素下标
     * @param value
     * @returns
     */
    find(value: T): number;
    /**
     * 查找元素下标
     * @param predicate
     * @returns
     */
    findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number;
    /**
     * 获取指定元素
     * @param index
     * @returns
     */
    get(index: number): T;
    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements(): Array<T>;
}
