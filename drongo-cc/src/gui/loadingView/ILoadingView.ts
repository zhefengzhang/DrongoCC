import { ILoadingData } from "./ILoadingData";


/**
 * 加载界面
 */
export interface ILoadingView {
    
    /**
     * 更新
     * @param data 
     */
    changeData(data: ILoadingData): void;

    /**
     * 显示
     */
    show(): void;

    /**
     * 隐藏
     */
    hide(): void;
}