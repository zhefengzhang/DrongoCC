import { List } from "../containers/List";
import { Dictionary } from "../drongo-cc";
import { IResourceManager } from "./IResManager";
import { IResource } from "./IResource";
import { ResRef } from "./ResRef";
/**
 * 默认资源管理器
 * @internal
 */
export declare class ResourceManagerImpl implements IResourceManager {
    /**
     * 资源
     */
    protected __resDic: Dictionary<string, IResource>;
    /**
     * 等待销毁的资源
     */
    protected _waitDestory: List<IResource>;
    constructor();
    tick(dt: number): void;
    addRes(value: IResource): void;
    hasRes(key: string): boolean;
    addResRef(key: string, refKey?: string): ResRef;
    removeResRef(value: ResRef): void;
    gc(ignoreTime?: boolean): void;
    /**
     * 销毁
     * @param value
     */
    protected destoryRes(value: IResource): void;
    get resList(): Array<IResource>;
}
