import { ITicker } from "../tick/ITicker";
import { IResource } from "./IResource";
import { ResRef } from "./ResRef";
/**
 * 资源管理器接口
 */
export interface IResourceManager extends ITicker {
    /**
     * 添加一个资源
     * @param value
     */
    addRes(value: IResource): void;
    /**
     * 是否包含该资源
     * @param key
     */
    hasRes(key: string): boolean;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    addResRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    removeResRef(value: ResRef): void;
    /**
     * 资源清理
     */
    gc(ignoreTime?: boolean): void;
    /**
     * 资源列表
     */
    readonly resList: Array<IResource>;
}
