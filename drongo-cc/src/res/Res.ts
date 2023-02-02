import { Asset, AssetManager, assetManager } from "cc";
import { IResource } from "./IResource";
import { ResManager } from "./ResManager";
import { Resource } from "./Resource";
import { ResRef } from "./ResRef";
import { ResURL, url2Key } from "./ResURL";

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
     * @param urls      
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static async getResRef(urls: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<ResRef | Array<ResRef>> {
        if (Array.isArray(urls)) {
            let list = [];
            let loaded: number = 0;
            for (let index = 0; index < urls.length; index++) {
                const url = urls[index];
                const result = await this.loadAsset(
                    url,
                    refKey,
                    (childProgress: number) => {
                        if (progress) {
                            progress((loaded + childProgress) / urls.length);
                        }
                    });
                list.push(result);
            }
            return await Promise.all(list);
        } else {
            //已加载完成
            let urlKey: string = url2Key(urls);
            if (ResManager.hasRes(urlKey)) {
                return Promise.resolve(ResManager.addResRef(urlKey, refKey));
            }
            return await this.loadAsset(
                urls,
                refKey,
                (childProgress: number) => {
                    if (progress) {
                        progress(childProgress);
                    }
                });
        }
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
        bundle.load(url.url, url.type, progress, (err: Error, asset: Asset) => {
            if (err) {
                cb(err);
                return;
            }
            const urlKey = url2Key(url);
            //如果已经存在
            if (ResManager.hasRes(urlKey)) {
                cb(undefined, ResManager.addResRef(urlKey, refKey));
                return;
            }else{
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = asset;
                ResManager.addRes(res);
                cb(undefined, ResManager.addResRef(urlKey, refKey));
            }
        });
    }
}