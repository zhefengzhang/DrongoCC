import { Asset, AssetManager, assetManager } from "cc";
import { Pool } from "../utils/Pool";
import { IResource } from "./IResource";
import { ResManager } from "./ResManager";
import { ResRef } from "./ResRef";
import { ResURL, ResURL2Key } from "./ResURL";


export class Res {
    
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
    static async getResRef(urls: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<ResRef | Array<ResRef>> {
        if (!this.getCCAssetByType) {
            throw new Error("类型获取函数未设置!");
        }
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
            let urlKey: string = ResURL2Key(urls);
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
        const urlKey: string = ResURL2Key(url);
        if (ResManager.hasRes(urlKey)) {
            return Promise.resolve(ResManager.addResRef(urlKey, refKey));
        }
        let promise = new Promise<ResRef>(
            (resolve, reject) => {
                if (typeof url == "string") {
                    throw new Error("未实现！");
                }
                let bundle = assetManager.getBundle(url.bundle);
                if (!bundle) {
                    assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        let ccType = this.getCCAssetByType(url.type);
                        bundle.load(url.url, ccType, (err: Error, asset: Asset) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            let res: IResource = this.resourcePool.allocate();
                            res.key = urlKey;
                            res.content = asset;
                            ResManager.addRes(res);
                            resolve(ResManager.addResRef(urlKey, refKey));
                        });
                    });
                } else {
                    let ccType = this.getCCAssetByType(url.type);
                    bundle.load(
                        url.url,
                        ccType,
                        progress,
                        (err: Error, asset: Asset) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            let res: IResource = this.resourcePool.allocate();
                            res.key = urlKey;
                            res.content = asset;
                            ResManager.addRes(res);
                            resolve(ResManager.addResRef(urlKey, refKey));
                        });
                }
            });
        return promise;
    }
}