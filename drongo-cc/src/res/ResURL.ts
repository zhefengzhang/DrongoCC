import { Asset, SpriteFrame, Texture2D } from "cc";



export type ResURL = string | { url: string, bundle: string, type: string | typeof Asset };

/**
 * 资源地址转唯一KEY
 * @param url 
 * @returns 
 */
export function url2Key(url: ResURL): string {
    return ResURLUtils.url2Key(url);
}

/**
 * 唯一key转URL
 * @param key 
 * @returns 
 */
export function key2URL(key: string): ResURL {
    return ResURLUtils.key2Url(key);
}


class ResURLUtils {

    static __assetTypes = new Map<string, typeof Asset>();


    private static getAssetType(key: string): typeof Asset {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key);
    }

    private static __getURL(key: string): string {
        let len: number = key.length;
        let end: number = len - 8;
        //texture
        let t = key.substring(end);
        if (t === "/texture") {
            return key.substring(0, end);
        }
        //spriteFrame
        end = len - 12;
        t = key.substring(end);
        if (t === "/spriteFrame") {
            return key.substring(0, end);
        }
        return key;
    }

    /**
     * 唯一key转URL
     * @param key 
     * @returns 
     */
    static key2Url(key: string): ResURL {
        if (key.indexOf("|")) {
            let arr: Array<string> = key.split("|");
            return { url: this.__getURL(arr[0]), bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }

    /**
     * 资源地址转唯一KEY
     * @param url 
     * @returns 
     */
    static url2Key(url: ResURL): string {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        if (url.type == SpriteFrame) {
            return url.url + "/spriteFrame" + "|" + url.bundle + "|" + this.getClassName(url.type);
        }
        if (url.type == Texture2D) {
            return url.url + "/texture" + "|" + url.bundle + "|" + this.getClassName(url.type);
        }
        return url.url + "|" + url.bundle + "|" + this.getClassName(url.type);
    }

    private static getClassName(clazz: any): string {
        let className: string;
        if (typeof clazz != "string") {
            className = clazz.toString();
        } else {
            className = clazz;
        }
        className = className.replace("function ", "");
        let index: number = className.indexOf("()");
        if (index < 0) {
            throw new Error("获取类型名称错误：" + className);
        }
        className = className.substring(0, index);
        if (!this.__assetTypes.has(className)) {
            this.__assetTypes.set(className, clazz);
        }
        return className;
    }
}