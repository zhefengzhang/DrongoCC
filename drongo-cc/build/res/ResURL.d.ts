import { Asset } from "cc";
export type ResURL = string | {
    url: string;
    bundle: string;
    type: string | typeof Asset;
};
/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
export declare function resURL2Key(url: ResURL): string;
/**
 * 唯一key转URL
 * @param key
 * @returns
 */
export declare function key2ResURL(key: string): ResURL;
