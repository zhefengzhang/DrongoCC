import { Asset, AssetManager, assetManager } from "cc";
import { Pool } from "../utils/Pool";
import { IResource } from "./IResource";
import { ResManager } from "./ResManager";
import { ResRef } from "./ResRef";
import { ResURL, resURL2Key } from "./ResURL";

export type ResLoader = (url: ResURL, bundle: AssetManager.Bundle, progress?: (progress: number) => void, cb?: (err: Error, asset: Asset) => void) => void;

export class Res {

    /**资源对象池 */
    static resourcePool: Pool<any>;

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
        if (!this.resourcePool) {
            throw new Error("资源对象池未设置！");
        }
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
            let urlKey: string = resURL2Key(urls);
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
        const urlKey: string = resURL2Key(url);
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
                        if (typeof url.type == "function") {
                            loader = this.defaultAssetLoader;
                        } else {
                            loader = this.getResLoader(url.type);
                        }
                        loader(url, bundle, progress, (err: Error, asset: any) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (ResManager.hasRes(urlKey)) {
                                resolve(ResManager.addResRef(urlKey, refKey));
                            } else {
                                let res: IResource = this.resourcePool.allocate();
                                res.key = urlKey;
                                res.content = asset;
                                ResManager.addRes(res);
                                resolve(ResManager.addResRef(urlKey, refKey));
                            }
                        });
                    });
                } else {
                    if (typeof url.type == "function") {
                        loader = this.defaultAssetLoader;
                    } else {
                        loader = this.getResLoader(url.type);
                    }
                    loader(url, bundle, progress, (err: Error, asset: Asset) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (ResManager.hasRes(urlKey)) {
                            resolve(ResManager.addResRef(urlKey, refKey));
                        } else {
                            let res: IResource = this.resourcePool.allocate();
                            res.key = urlKey;
                            res.content = asset;
                            ResManager.addRes(res);
                            resolve(ResManager.addResRef(urlKey, refKey));
                        }
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
    static defaultAssetLoader(url: ResURL, bundle: AssetManager.Bundle, progress?: (progress: number) => void, cb?: (err: Error, asset: any) => void): void {
        if (typeof url == "string") {
            throw new Error("url不能为字符串" + url);
        }
        if (typeof url.type == "string") {
            throw new Error("url.type不能为字符串" + url);
        }
        bundle.load(url.url, url.type, progress, cb);
    }
}