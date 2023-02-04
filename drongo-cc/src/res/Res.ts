import { Asset, AssetManager, assetManager } from "cc";
import { ResManager } from "./ResManager";
import { Resource } from "./Resource";
import { ResRef } from "./ResRef";
import { fullURL, ResURL, url2Key } from "./ResURL";

/**
 * 资源加载器
 */
export type ResLoader = (url: ResURL,
    bundle: AssetManager.Bundle,
    refKey: string,
    progress?: (progress: number) => void,
    cb?: (err: Error, resRef: ResRef) => void) => void;

export class Res {

    private static __loaders = new Map<string, ResLoader>();

    static setResLoader(key: string, loader: ResLoader): void {
        this.__loaders.set(key, loader);
    }

    static getResLoader(key: string): ResLoader {
        if (!this.__loaders.has(key)) {
            throw new Error("未注册的加载器：" + key);
        }
        return this.__loaders.get(key);
    }
    
    /**
     * 获取资源引用
     * @param url   
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static async getResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef> {
        if (Array.isArray(url)) {
            throw new Error("获取资源列表请调用getResRefList或getResRefMap");
        }
        //已加载完成
        let urlKey: string = url2Key(url);
        if (ResManager.hasRes(urlKey)) {
            return Promise.resolve(ResManager.addResRef(urlKey, refKey));
        }
        return await this.loadAsset(url, refKey, (childProgress: number) => { if (progress) progress(childProgress) });
    }
    
    /**
     * 获取资源引用列表
     * @param urls 
     * @param refKey 
     * @param progress 
     * @returns 
     */
    static async getResRefList(urls: Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<Array<ResRef>> {
        let tasks = [];
        let loaded: number = 0;
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            const task = await this.loadAsset(
                url,
                refKey,
                (childProgress: number) => {
                    if (progress) {
                        progress((loaded + childProgress) / urls.length);
                    }
                });
            tasks.push(task);
        }
        return await Promise.all(tasks);
    }

    /**
     * 获取资源引用字典
     * @param urls 
     * @param refKey 
     * @param result 
     * @param progress 
     * @returns 
     */
    static async getResRefMap(urls: Array<ResURL>, refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>> {
        result = result || new Map<string, ResRef>();
        let resRefs = await this.getResRefList(urls, refKey, progress);
        for (let index = 0; index < resRefs.length; index++) {
            const element = resRefs[index];
            result.set(element.key, element);
        }
        return Promise.resolve(result);
    }

    private static async loadAsset(url: ResURL, refKey: string, progress: (progress: number) => void): Promise<ResRef> {
        //已加载完成
        const urlKey: string = url2Key(url);
        if (ResManager.hasRes(urlKey)) {
            return Promise.resolve(ResManager.addResRef(urlKey, refKey));
        }
        let promise = new Promise<ResRef>(
            (resolve, reject) => {
                if (typeof url == "string") {
                    throw new Error("未实现！");
                }
                let bundle = assetManager.getBundle(url.bundle);
                let loader: ResLoader;
                if (!bundle) {
                    assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (typeof url.type == "string") {
                            loader = this.getResLoader(url.type);
                        } else {
                            loader = this.defaultAssetLoader;
                        }
                        loader(url, bundle, refKey, progress, (err: Error, resRef: ResRef) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(resRef);
                        });
                    });
                } else {
                    if (typeof url.type == "string") {
                        loader = this.getResLoader(url.type);
                    } else {
                        loader = this.defaultAssetLoader;
                    }
                    loader(url, bundle, refKey, progress, (err: Error, resRef: ResRef) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(resRef);
                    });
                }
            });
        return promise;
    }

    /**
     * 默认加载器
     * @param url 
     * @param bundle 
     * @param progress 
     * @param cb 
     */
    static defaultAssetLoader(url: ResURL, bundle: AssetManager.Bundle, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error, resRef?: ResRef) => void): void {
        if (typeof url == "string") {
            throw new Error("url不能为字符串" + url);
        }
        if (typeof url.type == "string") {
            throw new Error("url.type不能为字符串" + url);
        }
        bundle.load(fullURL(url), url.type, progress, (err: Error, asset: Asset) => {
            if (err) {
                cb(err);
                return;
            }
            const urlKey = url2Key(url);
            //如果已经存在
            if (ResManager.hasRes(urlKey)) {
                cb(undefined, ResManager.addResRef(urlKey, refKey));
                return;
            } else {
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = asset;
                ResManager.addRes(res);
                cb(undefined, ResManager.addResRef(urlKey, refKey));
            }
        });
    }
}