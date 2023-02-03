import { TooltipsData } from "../FairyGUI";
import { ITooltipsView } from "./ITooltipsView";


/**
 * tooltip管理器
 */
export interface ITooltipsManager {

    /**
     * 注册
     * @param type 
     * @param value 
     */
    register(type: string, value: ITooltipsView): void;

    /**
     * 注销
     * @param type
     */
    unregister(type: string): void;

    /**
     * 是否正在显示中
     */
    readonly isShowing: boolean;
    /**
     * 显示
     * @param data 
     */
    show(data: TooltipsData | undefined): void;
    /**
     * 隐藏
     */
    hide(): void;
}