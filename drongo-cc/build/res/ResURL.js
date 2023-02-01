/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
export function ResURL2Key(url) {
    if (url == null || url == undefined) {
        return "";
    }
    if (typeof url == "string") {
        return url;
    }
    return url.url + "|" + url.bundle + "|" + url.type;
}
/**
 * 唯一key转URL
 * @param key
 * @returns
 */
export function key2ResURL(key) {
    if (key.indexOf("|")) {
        let arr = key.split("|");
        return { url: arr[0], bundle: arr[1], type: arr[2] };
    }
    return key;
}
