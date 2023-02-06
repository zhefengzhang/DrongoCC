import { AssetManager } from "cc";
import { ResManager, ResRef, ResURL, url2Key } from "drongo-cc";
import { UIPackage } from "drongo-fgui";
import { FGUIResource } from "./FGUIResource";


/**
 * FGUI资源加载器
 * @param url 
 * @param bundle 
 * @param refKey 
 * @param progress 
 * @param cb 
 */
export function fguiResLoader(url: ResURL, bundle: AssetManager.Bundle, refKey: string, progress?: (progress: number) => void, cb?: (err: Error, resRef: ResRef) => void): void {
    if (typeof url == "string") {
        if (cb) {
            cb(new Error(url + "类型不正确！"), null);
        }
    } else {
        UIPackage.loadPackage(bundle, url.url,
            (finish: number, total: number, item: AssetManager.RequestItem) => {
                if (progress) {
                    progress(finish / total);
                }
            },
            (err: Error, pkg: UIPackage) => {
                if (err) {
                    if (cb) {
                        cb(err, null);
                    }
                    return;
                }
                const urlKey = url2Key(url);
                if (!ResManager.hasRes(urlKey)) {
                    let res = new FGUIResource();
                    res.key = urlKey;
                    res.content = pkg;
                    ResManager.addRes(res);
                }
                let ref = ResManager.addResRef(urlKey, refKey);
                if (cb) {
                    cb(null, ref);
                }
            });
    }
}

