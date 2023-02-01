import { Injector } from "../utils/Injector";
import { IResourceManager } from "./IResManager";
import { IResource } from "./IResource";
import { ResRef } from "./ResRef";



export class ResManager {

    static KEY: string = "ResManager";

    /**
     * 资源保留长时间GC
     */
    static GC_TIME: number = 15;

    /**
     * 自动清理
     */
    static AUTO_GC: boolean = true;

    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value: IResource): void {
        this.impl.addRes(value);
    }

    /**
     * 是否包含该资源
     * @param key 
     */
    static hasRes(key: string): boolean {
        return this.impl.hasRes(key);
    }

    /**
     * 添加并返回一个资源引用
     * @param key 
     * @param refKey 
     */
    static addResRef(key: string, refKey?: string): ResRef {
        return this.impl.addResRef(key, refKey);
    }

    /**
     * 删除一个资源引用
     * @param value 
     */
    static removeResRef(value: ResRef): void {
        return this.impl.removeResRef(value);
    }

    /**
     * 资源清理
     */
    static gc(ignoreTime?: boolean): void {
        return this.impl.gc(ignoreTime);
    }

    /**
     * 资源列表
     * @returns 
     */
    static resList(): Array<IResource> {
        return this.impl.resList;
    }

    private static __impl: IResourceManager;
    private static get impl(): IResourceManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}