import { Event, GUIManager, GUIState, IEventDispatcher, IGUIManager, IGUIMediator, ILayer, IRelationInfo, IRelationList, LayerManager, LoadingView, RelationManager, TickerManager, Timer } from "drongo-cc";
import { Layer } from "../drongo-gui";
import { GUIProxy } from "./GUIProxy";
import { IGUIInfo } from "./IGUIInfo";




/**
 * GUI管理器
 */
export class GUIManagerImpl implements IGUIManager {

    /**已注册*/
    private __registered: Map<number, IGUIInfo> = new Map<number, IGUIInfo>();
    /**实例 */
    private __instances: Map<number, GUIProxy> = new Map<number, GUIProxy>();

    /**
     * 删除列表
     */
    private __destryList: Array<number> = [];

    constructor() {
        TickerManager.addTicker(this);

        //监听打开和关闭事件
        Event.on(Event.SHOW, this.__showedHandler, this);
        Event.on(Event.HIDE, this.__closedHandler, this);
    }

    /**获取某个组件 */
    getUIComponent(key: number, path: string) {
        if (!this.__instances.has(key)) {
            throw new Error("GUI：" + key + "实例，不存在！");
        }
        let guiProxy: GUIProxy = this.__instances.get(key);
        return guiProxy.getComponent(path);
    }
    /**
     * 获取界面的mediator
     * @param key 
     */
    getMediatorByKey(key: number): IGUIMediator | null {
        if (!this.__instances.has(key)) {
            return null;
        }
        return this.__instances.get(key).mediator;
    }

    private __showedHandler(type: string, target: IEventDispatcher, data: any): void {
        let guiKey: number = data;
        this.setGUIState(guiKey, GUIState.Showed);
    }

    private __closedHandler(type: string, target: IEventDispatcher, data: any): void {
        let guiKey: number = data;
        this.setGUIState(guiKey, GUIState.Closed);
    }

    register(info: IGUIInfo): void {
        if (this.__registered.has(info.key)) {
            throw new Error("重复注册！");
        }
        this.__registered.set(info.key, info);
    }

    unregister(key: number): void {
        if (!this.__registered.has(key)) {
            throw new Error("未找到要注销的界面信息！");
        }
        this.__registered.delete(key);
    }

    tick(dt: number): void {
        this.__destryList.length = 0;
        let currentTime: number = Timer.currentTime;
        // value和key就是map的key，value，map是字典本身
        this.__instances.forEach((value, key, map) => {
            if (value.info.state == GUIState.Showed) {
                value.tick(dt);
            } else if (value.info.state == GUIState.Closed) {
                if (!value.info!.permanence) {
                    if (currentTime - value.closeTime > GUIManager.GUI_GC_INTERVAL) {
                        this.__destryList.push(key);
                    }
                }
            }
        });
        if (this.__destryList.length > 0) {
            let gui: GUIProxy;
            for (let index = 0; index < this.__destryList.length; index++) {
                const key = this.__destryList[index];
                gui = this.__instances.get(key)!;
                gui.info.state = GUIState.Null;//标记为null;
                this.__instances.delete(key);
                gui.destroy();
            }
        }
    }


    open(key: number, data?: any): void {
        this.__open(key, data);
        this.__checkRelation(key, true);
    }

    private __open(key: number, data?: any): void {
        let state: GUIState = this.getGUIState(key);
        let guiProxy: GUIProxy;
        //没打开过！
        if (state == GUIState.Null) {
            let info: IGUIInfo = this.__registered.get(key)!;
            guiProxy = new GUIProxy(info);
            guiProxy.info.state = GUIState.Showing;
            this.__instances.set(info.key, guiProxy);
            this.checkFullLayer(guiProxy);
            guiProxy.show(data);
            return;
        }
        //打开中
        if (state == GUIState.Showing) {
            guiProxy = this.__instances.get(key)!;
            this.checkFullLayer(guiProxy);
            //只是更新数据
            guiProxy.show(data);
            return;
        }
        //已经打开
        if (state == GUIState.Showed) {
            guiProxy = this.__instances.get(key)!;
            this.checkFullLayer(guiProxy);
            guiProxy.showedUpdate(data);
            //界面已打开，则隐藏进度条
            LoadingView.hide();
            return;
        }
        //关闭/关闭中
        if (state == GUIState.Closeing || state == GUIState.Closed) {
            guiProxy = this.__instances.get(key)!;
            guiProxy.info.state = GUIState.Showing;
            this.checkFullLayer(guiProxy);
            guiProxy.show(data);
            return;
        }
    }

    //全屏层同时只能打开一个界面
    private checkFullLayer(guiProxy: GUIProxy): void {
        let layer: Layer = LayerManager.getLayer(guiProxy.info.layer) as Layer;
        if (layer.isFullScrene) {
            for (let index = 0; index < layer.openRecord.length; index++) {
                const guiKey = layer.openRecord[index];
                //新打开的界面也可能在记录里
                if (guiKey != guiProxy.info.key) {
                    this.__close(guiKey);
                }
            }
            layer.openRecord.push(guiProxy.info.key);
        }
    }

    close(key: number, checkLayer: boolean = true): void {
        this.__close(key, checkLayer);
        this.__checkRelation(key, false);
    }

    closeAll() {
        this.__instances.forEach((value, key, map) => {
            this.close(key, false);
        });
    }

    private __close(key: number, checkLayer: boolean = false): void {
        let state: GUIState = this.getGUIState(key);
        let guiProxy: GUIProxy;
        //关闭中/已关闭
        if (state == GUIState.Null || state == GUIState.Closed || state == GUIState.Closeing) {
            return;
        }
        guiProxy = this.__instances.get(key)!;
        guiProxy.closeTime = Timer.currentTime;
        guiProxy.info.state = GUIState.Closeing;
        guiProxy.hide();

        if (!checkLayer) {
            return;
        }
        //通过记录找到要打开的界面
        let layer: Layer = LayerManager.getLayer(guiProxy.info.layer) as Layer;
        if (layer.isFullScrene && layer.openRecord.length > 1) {
            layer.openRecord.pop();
            let guikey: number = layer.openRecord.pop();
            // console.log("关闭："+key+"时，回到："+guikey);
            this.__open(guikey);
        }
    }

    /**
     * 检测UI关联关系
     * @param key 
     */
    private __checkRelation(key: number, isOpen: boolean): void {
        //关联UI
        let relation: IRelationInfo = RelationManager.getRelation(key);
        let relationList: IRelationList;
        if (relation) {
            //打开
            if (isOpen) {
                relationList = relation.show;
            } else {//关闭
                relationList = relation.hide;
            }
            let guiKey: number;
            for (let index = 0; index < relationList.show.length; index++) {
                guiKey = relationList.show[index];
                this.__open(guiKey);
            }
            for (let index = 0; index < relationList.hide.length; index++) {
                guiKey = relationList.hide[index];
                this.__close(guiKey);
            }
        }
    }
    /**
     * 获得前一个打开的全屏界面
     */
    getPrevLayer(): number {
        let layers: ILayer[] = LayerManager.getAllLayer();
        for (let i = 0, len = layers.length; i < len; i += 1) {
            if ((layers[i] as Layer).isFullScrene) {
                if ((layers[i] as Layer).openRecord.length > 1) {
                    return (layers[i] as Layer).openRecord[(layers[i] as Layer).openRecord.length - 2];
                }
                break;
            }
        }

        return -1;
    }

    /**
     * 获取界面状态
     * @param key 
     */
    getGUIState(key: number): GUIState {
        if (!this.__registered.has(key)) {
            throw new Error("GUI:" + key + "未注册！")
        }
        //不存在
        if (!this.__instances.has(key)) {
            return GUIState.Null;
        }
        let proxy: GUIProxy = this.__instances.get(key);
        return proxy.info.state;
    }

    setGUIState(key: number, state: GUIState): void {
        if (!this.__registered.has(key)) {
            throw new Error("GUI:" + key + "未注册！")
        }
        let info: IGUIInfo = this.__registered.get(key);
        info.state = state;
    }

    /**
     * 是否已打开或打开中
     * @param key 
     * @returns 
     */
    isOpen(key: number): boolean {
        let state: GUIState = this.getGUIState(key);
        if (state == GUIState.Showing || state == GUIState.Showed) {
            return true;
        }
        return false;
    }
}
