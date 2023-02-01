import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 字典
 */
export class Dictionary extends EventDispatcher {
    constructor() {
        super();
        this.__map = new Map();
        this.__dataChanged = false;
        this.__cacheElements = [];
    }
    set(key, value) {
        let old;
        if (this.__map.has(key)) {
            old = this.__map.get(key);
            if (old) {
                //删除老的
                this.delete(key);
            }
        }
        if (value) {
            //添加新的
            this.__map.set(key, value);
            this.__dataChanged = true;
        }
        if (old && value) {
            //派发更新事件
            if (this.hasEvent(Event.UPDATE)) {
                this.emit(Event.UPDATE, { oldValue: old, newValue: value });
            }
        }
        else {
            if (old) {
                //派发删除事件
                if (this.hasEvent(Event.REMOVE)) {
                    this.emit(Event.REMOVE, old);
                }
            }
            else if (value) {
                //派发添加事件
                if (this.hasEvent(Event.ADD)) {
                    this.emit(Event.ADD, value);
                }
            }
        }
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
     * 删除指定元素
     * @param key
     * @returns
     */
    delete(key) {
        if (!this.__map.has(key)) {
            return undefined;
        }
        const result = this.__map.get(key);
        this.__map.delete(key);
        this.__dataChanged = true;
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
        this.__cacheElements.length = 0;
        this.__dataChanged = false;
        this.__map.clear();
    }
    /**
    * 元素列表
    */
    get elements() {
        if (this.__dataChanged) {
            this.__cacheElements.length = 0;
            this.__map.forEach((value, key) => {
                this.__cacheElements.push(value);
            });
            this.__dataChanged = false;
        }
        return this.__cacheElements;
    }
    /**
     * key列表
     */
    get keys() {
        let __keys = [];
        this.__map.forEach((v, key) => {
            __keys.push(key);
        });
        return __keys;
    }
    get size() {
        return this.__map.size;
    }
    ;
    destroy() {
        super.destroy();
        this.__cacheElements = null;
        this.__map.clear();
        this.__map = null;
    }
}
