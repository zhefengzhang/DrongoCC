/**
 * 对象池
 */
export class Pool {
    constructor(clazz, maxCount) {
        /**池中闲置对象 */
        this.__cacheStack = new Array();
        /**正在使用的对象 */
        this.__usingArray = new Array();
        /**池中对象最大数 */
        this.__maxCount = 0;
        this.__class = clazz;
        if (!this.__class) {
            throw new Error("构造函数不能为空！");
        }
        this.__maxCount = maxCount == undefined ? Number.MAX_SAFE_INTEGER : maxCount;
    }
    /**
    * 在池中的对象
    */
    get count() {
        return this.__cacheStack.length;
    }
    /**
     * 使用中的数量
     */
    get usingCount() {
        return this.__usingArray.length;
    }
    /**
     * 分配
     * @returns
     */
    allocate() {
        if (this.count + this.usingCount < this.__maxCount) {
            let element = this.__cacheStack.length > 0 ? this.__cacheStack.pop() : new this.__class();
            this.__usingArray.push(element);
            return element;
        }
        throw new Error("对象池最大数量超出：" + this.__maxCount);
    }
    /**
     * 回收到池中
     * @param value
     * @returns
     */
    recycle(value) {
        if (this.__cacheStack.indexOf(value) > -1) {
            throw new Error("重复回收！");
        }
        let index = this.__usingArray.indexOf(value);
        if (index < 0) {
            throw new Error("对象不属于改对象池！");
        }
        //重置
        value.reset();
        this.__usingArray.splice(index, 1);
        this.__cacheStack.push(value);
    }
    /**
     * 批量回收
     * @param list
     */
    recycleList(list) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            this.recycle(element);
        }
    }
    /**
     * 将所有使用中的对象都回收到池中
     */
    recycleAll() {
        for (let index = 0; index < this.__usingArray.length; index++) {
            const element = this.__usingArray[index];
            this.recycle(element);
        }
    }
    destroy() {
        this.recycleAll();
        for (let index = 0; index < this.__cacheStack.length; index++) {
            const element = this.__cacheStack[index];
            element.destroy();
        }
        this.__cacheStack.length = 0;
        this.__cacheStack = null;
        this.__usingArray.length = 0;
        this.__usingArray = null;
    }
}
