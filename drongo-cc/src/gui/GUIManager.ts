import { Injector } from "../utils/Injector";
import { GUIState } from "./core/GUIState";
import { IGUIManager } from "./core/IGUIManager";
import { IGUIMediator } from "./core/IGUIMediator";



/**
     * GUI 管理器
     */
export class GUIManager {

    static KEY: string = "drongo.GUIManager";
    
    /**
     * 在界面关闭后多长时间不使用则销毁(秒)
     */
    static GUI_GC_INTERVAL: number = 30;
    
    /**
     * 注册
     * @param info 
     * @returns 
     */
    static register(info: { key: number }): void {
        return this.impl.register(info);
    }

    /**
     * 注销
     * @param key 
     * @returns 
     */
    static unregister(key: number): void {
        return this.impl.unregister(key);
    }

    static open(key:number,data?:any):void{
        this.impl.open(key,data);
    }

    /**
     * 关闭
     * @param key 
     * @param checkLayer 是否检查全屏记录
     */
    static close(key:number,checkLayer:boolean=true):void{
        this.impl.close(key,checkLayer);
    }

    static closeAll():void {
        this.impl.closeAll();
    }
    
    /**
     * 获取界面状态
     * @param key 
     * @returns  0 未显示  1显示中
     */
    static getGUIState(key: number): GUIState {
        return this.impl.getGUIState(key);
    }

    /**
     * 是否已打开或再打开中
     * @param key 
     * @returns 
     */
    static isOpen(key:number):boolean{
        return this.impl.isOpen(key);
    }

    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    static getUIComponent(key:number,path:string):any{
        return this.impl.getUIComponent(key,path);
    }

    /**
     * 获取界面的mediator
     */
    static getMediatorByKey(key:number):IGUIMediator{
        return this.impl.getMediatorByKey(key);
    }

    /**
     * 获得前一个打开的全屏界面
     * @param curLayerKey 当前打开的全屏界面 
     */
    static getPrevLayer():number{
        return this.impl.getPrevLayer();
    }

    private static __impl: IGUIManager;
    private static get impl(): IGUIManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + GUIManager.KEY);
        }
        return this.__impl;
    }
}