
import { ILayer, ILayerManager } from "drongo-cc";
import { GRoot } from "drongo-fgui";
import { Layer } from "./Layer";


/**
 * cocos fgui 层管理器
 */
export class LayerManagerImpl implements ILayerManager {

    private __layerMap: Map<string, ILayer> = new Map<string, ILayer>();

    constructor() {

    }
    
    /**
     * 添加层
     * @param key 
     * @param layer 
     */
    addLayer(key: string, layer: ILayer): void {
        if (layer instanceof Layer) {
            GRoot.inst.addChild(layer);
            this.__layerMap.set(key, layer);
        } else {
            throw new Error("层必须是Layer");
        }
    }
    
    /**
     * 删除层
     * @param key 
     */
    removeLayer(key: string): void {
        let layer: Layer = this.__layerMap.get(key) as Layer;
        if (layer) {
            GRoot.inst.removeChild(layer);
            this.__layerMap.delete(key);
        } else {
            throw new Error("找不到要删除的层：" + key);
        }
    }

    getLayer(layerKey: string): ILayer | undefined {
        return this.__layerMap.get(layerKey);
    }

    /**
     * 获得所有层
     */
    getAllLayer(): ILayer[] {
        let _values: Array<ILayer> = [];
        this.__layerMap.forEach(function (v: ILayer, key: string) {
            _values.push(v);
        })
        return _values;
    }
}
