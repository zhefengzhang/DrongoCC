
import { List } from "../containers/List";
import { Dictionary } from "../drongo-cc";
import { TickerManager } from "../ticker/TickerManager";
import { Timer } from "../timer/Timer";
import { IResManager } from "./IResManager";
import { IResource } from "./IResource";
import { ResManager } from "./ResManager";
import { ResRef } from "./ResRef";



/**
 * 默认资源管理器
 * @internal
 */
export class ResManagerImpl implements IResManager {

    /**
     * 资源
     */
    protected __resDic: Dictionary<string, IResource> = new Dictionary<string, IResource>();
    /**
     * 等待销毁的资源
     */
    protected _waitDestory: List<IResource> = new List<IResource>();

    constructor() {
        TickerManager.addTicker(this);
    }

    tick(dt: number): void {
        if (ResManager.AUTO_GC) {
            this.gc();
        }
    }

    addRes(value: IResource): void {
        if (this.__resDic.has(value.key)) {
            throw new Error("重复添加资源！");
        }
        this.__resDic.set(value.key, value);
        //标记为待删除
        this._waitDestory.push(value);
        value.lastOpTime = Timer.currentTime;
    }

    hasRes(key: string): boolean {
        return this.__resDic.has(key);
    }

    _getRes(key: string): IResource {
        return this.__resDic.get(key);
    }

    addResRef(key: string, refKey?: string): ResRef {
        if (!this.__resDic.has(key)) {
            throw new Error("未找到资源：" + key);
        }
        let res: IResource = this.__resDic.get(key)!;
        //如果在待删除列表中
        if (this._waitDestory.has(res)) {
            this._waitDestory.remove(res);
        }
        //更新操作时间
        res.lastOpTime = Timer.currentTime;
        return res.addRef(refKey);
    }

    removeResRef(value: ResRef): void {
        if (!this.__resDic.has(value.key)) {
            throw new Error("未找到资源：" + value.key);
        }
        let res: IResource = this.__resDic.get(value.key)!;
        res.removeRef(value);
        if (res.refLength == 0) {
            //放入待删除列表
            this._waitDestory.push(res);
        }
        res.lastOpTime = Timer.currentTime;
    }

    gc(ignoreTime?: boolean): void {
        let res: IResource;
        let currentTime: number = Timer.currentTime;
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
            } else if (currentTime - res.lastOpTime > ResManager.GC_TIME) {//超过允许的时间就回收
                this.destoryRes(res);
                index--;
            }
        }
    }

    /**
     * 销毁
     * @param value 
     */
    protected destoryRes(value: IResource): void {
        this.__resDic.delete(value.key);
        value.destroy();
    }

    get resList(): Array<IResource> {
        return this.__resDic.elements;
    }
}