/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
export function resURL2Key(url) {
    return ResURLUtils.resURL2Key(url);
}
/**
 * 唯一key转URL
 * @param key
 * @returns
 */
export function key2ResURL(key) {
    return ResURLUtils.key2ResURL(key);
}
class ResURLUtils {
    static getAssetType(key) {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key);
    }
    /**
     * 唯一key转URL
     * @param key
     * @returns
     */
    static key2ResURL(key) {
        if (key.indexOf("|")) {
            let arr = key.split("|");
            return { url: arr[0], bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }
    /**
     * 资源地址转唯一KEY
     * @param url
     * @returns
     */
    static resURL2Key(url) {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        return url.url + "|" + url.bundle + "|" + this.getClassName(url.type);
    }
    static getClassName(clazz) {
        let className;
        if (typeof clazz != "string") {
            className = clazz.toString();
        }
        else {
            className = clazz;
        }
        className = className.replace("function ", "");
        let index = className.indexOf("()");
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
ResURLUtils.__assetTypes = new Map();
