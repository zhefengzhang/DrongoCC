import { assetManager, AssetManager } from "cc";
import { key2URL, Resource } from "drongo-cc";
import { UIPackage } from "drongo-fgui";


export class FGUIResource extends Resource {

    constructor() {
        super();
    }

    /**
     * 销毁
     */
    destroy(): void {
        let url = key2URL(this.key);
        if (typeof url != "string") {
            UIPackage.removePackage(url.url);
            let bundle = assetManager.getBundle(url.bundle);
            let asset = bundle.get(url.url);
            assetManager.releaseAsset(asset);
            console.log("销毁:FGUIPacage=>" + url.bundle + " " + url.url);
        } else {
            throw new Error("未处理的Fguipackage销毁！");
        }
        super.destroy();
    }
}