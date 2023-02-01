var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assetManager } from "cc";
import { ResManager } from "./ResManager";
import { ResURL2Key } from "./ResURL";
export class Res {
    /**
     * 获取资源引用
     * @param urls
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static getResRef(urls, refKey, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.getCCAssetByType) {
                throw new Error("类型获取函数未设置!");
            }
            if (!this.resourcePool) {
                throw new Error("资源对象池未设置！");
            }
            if (Array.isArray(urls)) {
                let list = [];
                let loaded = 0;
                for (let index = 0; index < urls.length; index++) {
                    const url = urls[index];
                    const result = yield this.loadAsset(url, refKey, (childProgress) => {
                        if (progress) {
                            progress((loaded + childProgress) / urls.length);
                        }
                    });
                    list.push(result);
                }
                return yield Promise.all(list);
            }
            else {
                //已加载完成
                let urlKey = ResURL2Key(urls);
                if (ResManager.hasRes(urlKey)) {
                    return Promise.resolve(ResManager.addResRef(urlKey, refKey));
                }
                return yield this.loadAsset(urls, refKey, (childProgress) => {
                    if (progress) {
                        progress(childProgress);
                    }
                });
            }
        });
    }
    static loadAsset(url, refKey, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            //已加载完成
            const urlKey = ResURL2Key(url);
            if (ResManager.hasRes(urlKey)) {
                return Promise.resolve(ResManager.addResRef(urlKey, refKey));
            }
            let promise = new Promise((resolve, reject) => {
                if (typeof url == "string") {
                    throw new Error("未实现！");
                }
                let bundle = assetManager.getBundle(url.bundle);
                if (!bundle) {
                    assetManager.loadBundle(url.bundle, (err, bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        let ccType = this.getCCAssetByType(url.type);
                        bundle.load(url.url, ccType, (err, asset) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            let res = this.resourcePool.allocate();
                            res.key = urlKey;
                            res.content = asset;
                            ResManager.addRes(res);
                            resolve(ResManager.addResRef(urlKey, refKey));
                        });
                    });
                }
                else {
                    let ccType = this.getCCAssetByType(url.type);
                    bundle.load(url.url, ccType, progress, (err, asset) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        let res = this.resourcePool.allocate();
                        res.key = urlKey;
                        res.content = asset;
                        ResManager.addRes(res);
                        resolve(ResManager.addResRef(urlKey, refKey));
                    });
                }
            });
            return promise;
        });
    }
}