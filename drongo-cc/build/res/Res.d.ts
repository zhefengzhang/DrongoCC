import { Asset, AssetManager } from "cc";
import { Pool } from "../utils/Pool";
import { ResRef } from "./ResRef";
import { ResURL } from "./ResURL";
export type ResLoader = (url: ResURL, bundle: AssetManager.Bundle, progress?: (progress: number) => void, cb?: (err: Error, asset: Asset) => void) => void;
export declare class Res {
    /**资源对象池 */
    static resourcePool: Pool<any>;
    private static __loaders;
    static setResLoader(key: string, loader: ResLoader): void;
    static getResLoader(key: string): ResLoader;
    /**
     * 获取资源引用
     * @param urls
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static getResRef(urls: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<ResRef | Array<ResRef>>;
    private static loadAsset;
    /**
     * 默认加载器
     * @param url
     * @param bundle
     * @param progress
     * @param cb
     */
    static defaultAssetLoader(url: ResURL, bundle: AssetManager.Bundle, progress?: (progress: number) => void, cb?: (err: Error, asset: any) => void): void;
}
