import { ILayer } from "./ILayer";


export interface ILayerManager {

    /**
     * 添加层
     * @param key 
     * @param layer 
     */
    addLayer(key: string, layer: ILayer): void;
    /**
     * 删除层
     * @param key 
     */
    removeLayer(key: string): void;

    /**
     * 获取层对象
     * @param key
     */
    getLayer(key: string): ILayer | undefined;
    /**
     * 获得所有层
     */
    getAllLayer():ILayer[];
}