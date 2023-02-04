import { IViewComponent } from "./IViewComponent";



export interface IGUIMediator {

    info: any;

    /**初始化完毕 */
    inited: boolean;

    /**
     * 显示节点
     */
    viewComponent: IViewComponent | null;

    /**
     * 播放显示动画
     * @param complete 
     */
    playShowAnimation?: (complete: Function) => void;

    /**
     * 界面关闭时播放的动画
     * @param complete 
     */
    playHideAnimation?: (complete: Function) => void;

    /**
     * 创建UI
     * @param info 
     * @param created 
     */
    createUI(info: any, created: Function): void;

    /**
     * 初始化
     */
    init(): void;

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void;

    /**
     * 显示(内部接口，请勿调用)
     * @param data 
     */
    show(data?: any): void;

    /**
     * 当已经处在显示中 GUIManager.call时 则调用该方法而不调用showedUpdate
     * @param data 
     */
    showedUpdate(data?: any): void;

    /**
     * 隐藏(内部接口，请勿调用)
     * @param info 
     */
    hide(): void;

    /**
     * 销毁
     */
    destroy(): void;

    /**
     * 获取组件
     * @param path 
     */
    getUIComponent(path: string): any;
}