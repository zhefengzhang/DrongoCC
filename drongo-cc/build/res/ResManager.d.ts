import { IResource } from "./IResource";
import { ResRef } from "./ResRef";
export declare class ResManager {
    static KEY: string;
    /**
     * 资源保留长时间GC
     */
    static GC_TIME: number;
    /**
     * 自动清理
     */
    static AUTO_GC: boolean;
    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value: IResource): void;
    /**
     * 是否包含该资源
     * @param key
     */
    static hasRes(key: string): boolean;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static addResRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    static removeResRef(value: ResRef): void;
    /**
     * 资源清理
     */
    static gc(ignoreTime?: boolean): void;
    /**
     * 资源列表
     * @returns
     */
    static resList(): Array<IResource>;
    private static __impl;
    private static get impl();
}
