import { TooltipsData } from "../FairyGUI";



export interface ITooltipsView{

    /**
     * view
     */
    viewComponent: any;

    /**
     * 更新数据
     * @param data 
     */
    update(data: TooltipsData): void;

    /**
     * 销毁
     */
    destroy():void;
}