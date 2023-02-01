import { Asset } from "cc";
import { Pool } from "../utils/Pool";
import { ResRef } from "./ResRef";
import { ResURL } from "./ResURL";
export type ResResult = ResRef | Array<ResRef> | Map<string, ResRef>;
export declare class Res {
    /**资源对象池 */
    static resourcePool: Pool<any>;
    /**
     * 根据字符串类型转cc.Asset的子类型
     */
    static getCCAssetByType: (type: string) => typeof Asset;
    /**
     * 获取资源引用
     * @param urls
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static getResRef(urls: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<ResRef | Array<ResRef>>;
    private static loadAsset;
}
