import { Injector } from "../utils/Injector";
export class ResManager {
    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value) {
        this.impl.addRes(value);
    }
    /**
     * 是否包含该资源
     * @param key
     */
    static hasRes(key) {
        return this.impl.hasRes(key);
    }
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static addResRef(key, refKey) {
        return this.impl.addResRef(key, refKey);
    }
    /**
     * 删除一个资源引用
     * @param value
     */
    static removeResRef(value) {
        return this.impl.removeResRef(value);
    }
    /**
     * 资源清理
     */
    static gc(ignoreTime) {
        return this.impl.gc(ignoreTime);
    }
    /**
     * 资源列表
     * @returns
     */
    static resList() {
        return this.impl.resList;
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}
ResManager.KEY = "ResManager";
/**
 * 资源保留长时间GC
 */
ResManager.GC_TIME = 15;
/**
 * 自动清理
 */
ResManager.AUTO_GC = true;
