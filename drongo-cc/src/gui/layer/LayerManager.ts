import { Injector } from "../../utils/Injector";
import { ILayer } from "./ILayer";
import { ILayerManager } from "./ILayerManager";



/**
 * 层管理器
 */
export class LayerManager {

    static KEY: string = "drongo.LayerManager";
    /**
     * 添加一个层
     * @param key 
     * @param layer 
     */
    static addLayer(key: string, layer: ILayer): void {
        this.impl.addLayer(key, layer);
    }

    /**
     * 删除层
     * @param key 
     */
    static removeLayer(key: string): void {
        this.impl.removeLayer(key);
    }

    /**
     * 获取层对象
     * @param key 
     */
    static getLayer(key: string): ILayer | undefined {
        return this.impl.getLayer(key);
    }

    /**
     * 获得所有层
     */
    static getAllLayer(): ILayer[] {
        return this.impl.getAllLayer();
    }

    private static __impl: ILayerManager;
    private static get impl(): ILayerManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY+"未注入！");
        }
        return this.__impl;
    }
}