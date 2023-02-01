import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 字典
 */
export class Dictionary extends EventDispatcher {
    constructor() {
        super();
        this.__map = new Map();
        this.__list = [];
    }
    set(key, value) {
        let old;
        //删除老的
        if (this.__map.has(key)) {
            old = this.__map.get(key);
            const index = this.__list.indexOf(old);
            if (index < 0) {
                throw new Error("Dictionary内部逻辑错误！");
            }
            this.__map.delete(key);
            this.__list.splice(index, 1);
            this.emit(Event.REMOVE, old);
        }
        this.__map.set(key, value);
        this.__list.push(value);
        this.emit(Event.ADD, value);
    }
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    has(key) {
        return this.__map.has(key);
    }
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    get(key) {
        return this.__map.get(key);
    }
    /**
     * 通过索引获取元素
     * @param index
     * @returns
     */
    getValue(index) {
        if (index >= this.__list.length) {
            throw new Error(index + "索引超出0-" + this.__list.length + "范围");
        }
        return this.__list[index];
    }
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    delete(key) {
        if (!this.__map.has(key)) {
            return undefined;
        }
        const result = this.__map.get(key);
        const index = this.__list.indexOf(result);
        if (index < 0) {
            throw new Error("Dictionary内部逻辑错误！");
        }
        this.__list.splice(index, 1);
        this.__map.delete(key);
        //派发删除事件
        if (this.hasEvent(Event.REMOVE)) {
            this.emit(Event.REMOVE, result);
        }
        return result;
    }
    /**
     * 清除所有元素
     */
    clear() {
        this.__map.clear();
        this.__list.length = 0;
    }
    /**
    * 元素列表
    */
    get elements() {
        return this.__list;
    }
    get size() {
        return this.__map.size;
    }
    destroy() {
        super.destroy();
        this.__map.clear();
        this.__map = null;
        this.__list = null;
    }
}
