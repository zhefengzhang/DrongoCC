import { List } from "../containers/List";
import { Dictionary } from "../drongo-cc";
import { TickManager } from "../tick/TickerManager";
import { Timer } from "../utils/Timer";
import { ResManager } from "./ResManager";
/**
 * 默认资源管理器
 * @internal
 */
export class ResourceManagerImpl {
    constructor() {
        /**
         * 资源
         */
        this.__resDic = new Dictionary();
        /**
         * 等待销毁的资源
         */
        this._waitDestory = new List();
        TickManager.addTicker(this);
    }
    tick(dt) {
        if (ResManager.AUTO_GC) {
            this.gc();
        }
    }
    addRes(value) {
        if (this.__resDic.has(value.key)) {
            throw new Error("重复添加资源！");
        }
        this.__resDic.set(value.key, value);
        //标记为待删除
        this._waitDestory.push(value);
        value.lastOpTime = Timer.currentTime;
    }
    hasRes(key) {
        return this.__resDic.has(key);
    }
    addResRef(key, refKey) {
        if (!this.__resDic.has(key)) {
            throw new Error("未找到资源：" + key);
        }
        let res = this.__resDic.get(key);
        //如果在待删除列表中
        if (this._waitDestory.has(res)) {
            this._waitDestory.remove(res);
        }
        //更新操作时间
        res.lastOpTime = Timer.currentTime;
        return res.addRef(refKey);
    }
    removeResRef(value) {
        if (!this.__resDic.has(value.key)) {
            throw new Error("未找到资源：" + value.key);
        }
        let res = this.__resDic.get(value.key);
        res.removeRef(value);
        if (res.refLength == 0) {
            //放入待删除列表
            this._waitDestory.push(res);
        }
        res.lastOpTime = Timer.currentTime;
    }
    gc(ignoreTime) {
        let res;
        let currentTime = Timer.currentTime;
        let list = this._waitDestory.elements;
        for (let index = 0; index < list.length; index++) {
            res = list[index];
            if (res.refCount > 0) {
                continue;
            }
            //如果忽略时间机制
            if (ignoreTime == true) {
                this.destoryRes(res);
                index--;
            }
            else if (currentTime - res.lastOpTime > ResManager.GC_TIME) { //超过允许的时间就回收
                this.destoryRes(res);
                index--;
            }
        }
    }
    /**
     * 销毁
     * @param value
     */
    destoryRes(value) {
        this.__resDic.delete(value.key);
        value.destory();
    }
    get resList() {
        return this.__resDic.elements;
    }
}
