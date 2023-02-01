/**
 * 可重复利用对象接口
 */
export interface IRecyclable {
    /**
     * 重置到可复用状态
     */
    reset(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 对象池
 */
export declare class Pool<T extends IRecyclable> {
    /**池中闲置对象 */
    private __cacheStack;
    /**正在使用的对象 */
    private __usingArray;
    /**池中对象最大数 */
    private __maxCount;
    private __class;
    constructor(clazz: {
        new (): T;
    }, maxCount?: number);
    /**
    * 在池中的对象
    */
    get count(): number;
    /**
     * 使用中的数量
     */
    get usingCount(): number;
    /**
     * 分配
     * @returns
     */
    allocate(): T;
    /**
     * 回收到池中
     * @param value
     * @returns
     */
    recycle(value: T): void;
    /**
     * 批量回收
     * @param list
     */
    recycleList(list: Array<T>): void;
    /**
     * 将所有使用中的对象都回收到池中
     */
    recycleAll(): void;
    destroy(): void;
}
