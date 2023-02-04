import { Injector } from 'drongo-cc';
import { GComponent, GRoot } from 'drongo-fgui';

class Layer extends GComponent {
    constructor(name, isFullScrene = false) {
        super();
        this.node.name = name;
        this.isFullScrene = isFullScrene;
        this.openRecord = [];
        this.makeFullScreen();
    }
    getCount() {
        return this.numChildren;
    }
}

/**
 * cocos fgui 层管理器
 */
class LayerManagerImpl {
    constructor() {
        this.__layerMap = new Map();
    }
    /**
     * 添加层
     * @param key
     * @param layer
     */
    addLayer(key, layer) {
        if (layer instanceof Layer) {
            GRoot.inst.addChild(layer);
            this.__layerMap.set(key, layer);
        }
        else {
            throw new Error("层必须是CCFUILayer");
        }
    }
    /**
     * 删除层
     * @param key
     */
    removeLayer(key) {
        let layer = this.__layerMap.get(key);
        if (layer) {
            GRoot.inst.removeChild(layer);
            this.__layerMap.delete(key);
        }
        else {
            throw new Error("找不到要删除的层：" + key);
        }
    }
    getLayer(layerKey) {
        return this.__layerMap.get(layerKey);
    }
    /**
     * 获得所有层
     */
    getAllLayer() {
        let _values = [];
        this.__layerMap.forEach(function (v, key) {
            _values.push(v);
        });
        return _values;
    }
}

/**
 * 层管理器
 */
class LayerManager {
    /**
     * 添加一个层
     * @param key
     * @param layer
     */
    static addLayer(key, layer) {
        this.impl.addLayer(key, layer);
    }
    /**
     * 删除层
     * @param key
     */
    static removeLayer(key) {
        this.impl.removeLayer(key);
    }
    /**
     * 获取层对象
     * @param key
     */
    static getLayer(key) {
        return this.impl.getLayer(key);
    }
    /**
     * 获得所有层
     */
    static getAllLayer() {
        return this.impl.getAllLayer();
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new LayerManagerImpl();
        }
        return this.__impl;
    }
}
LayerManager.KEY = "drongo.LayerManager";

export { Layer, LayerManager, LayerManagerImpl };
