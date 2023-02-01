import { ResRef } from "./ResRef";


/**
 * 资源接口
 */
export interface IResource {
    /**
     * 资源全局唯一KEY
     */
    key: string;
    /**
     * 最后一次操作的时间点
     */
    lastOpTime: number;
    /**
     * 资源
     */
    content: any;
    /**
     * 资源引用数量
     */
    readonly refCount: number;
    /**
     * 资源引用列表长度
     */
    readonly refLength: number;
    /**
     * 添加一个引用
     * @param refKey 
     */
    addRef(refKey?: string): ResRef;
    /**
     * 删除引用
     * @param value 
     */
    removeRef(value: ResRef): void;
    /**销毁*/
    destory(): void;
}