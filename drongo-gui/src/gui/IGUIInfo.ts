import { GUIState } from "drongo-cc";



export interface IGUIInfo{
    /**
     * UI 全局唯一KEY
     */
    key: number;
    /**
     * 是否永久存在
     */
    permanence: boolean;
    /**
     * UI所在层
     */
    layer: string;
    /**
     * 是否使用遮罩
     */
    modal: boolean;
    /**
     * 点击蒙版时时候关闭界面
     */
    modalClose: boolean;
    /**
     * AssetBundle 包名
     */
    bundleName: string;
    /**
     * UI名称
     */
    uiName: string;
    /**
     * UIPackage名称
     */
    packageName: string;
    /**
     * FGUI 组件名
     */
    comName: string;

    /**UI所属状态 */
    state: GUIState;
}