import { Asset, assetManager, instantiate, isValid, Node, Prefab } from "cc";
import { Debuger } from "../drongo-cc";
import { IRecyclable } from "../utils/Pool";
import { IResource } from "./IResource";
import { ResRef } from "./ResRef";



export class Resource implements IResource,IRecyclable {

    /**
     * 状态 0 正常 1待删除
     */
    state: number = 0;

    key: string = "";

    lastOpTime: number = 0;

    /**
     * @internal
     */
    private __refs: ResRef[] = [];

    constructor() {

    }
    
    reset(): void {
        
    }

    set content(value: any) {
        this.__content = value;
        if (this.__content instanceof Asset) {
            //防止自动回收
            this.__content.addRef();
        }
    }

    private __content: any = null;
    get content(): any {
        return this.__content;
    }

    addRef(refKey?: string): ResRef {
        let rf: ResRef = new ResRef();
        rf.key = this.key;
        rf.refKey = refKey;
        if (this.content instanceof Asset) {
            if (this.content instanceof Prefab) {
                rf.content = instantiate(this.content);
            } else {
                rf.content = this.content;
            }
            this.content.addRef();
        } else {
            rf.content = this.content;
        }
        this.__refs.push(rf);
        return rf;
    }

    removeRef(value: ResRef): void {
        let index: number = this.__refs.indexOf(value);
        if (index < 0) {
            throw new Error("未找到需要删除的引用！");
        }
        if (this.content instanceof Asset) {
            //预制体处理
            if (this.content instanceof Prefab) {
                let node: Node = value.content;
                if (isValid(node)) {
                    node.destroy();
                }
            }
            this.content.decRef();
        }
        this.__refs.splice(index, 1);
        value.destroy();
    }

    destroy(): void {
        if (this.refCount > 0 || this.refLength > 0) {
            throw new Error("发现销毁资源时引用数量不为0");
        }
        //自身引用计数
        if (this.__content instanceof Asset) {
            this.__content.decRef();
            if (this.__content.refCount <= 0) {
                Debuger.log("Res", "资源销毁=>" + this.key);
                assetManager.releaseAsset(this.__content);
            }
        }
        this.key = "";
        this.__refs.length = 0;
        this.__content = null;
    }

    /**
     * 引用数量
     */
    get refCount(): number {
        if (this.__content instanceof Asset) {
            return this.__content.refCount - 1;
        }
        return this.__refs.length;
    }

    /**
     * 引用列表长度
     */
    get refLength(): number {
        return this.__refs.length;
    }
}