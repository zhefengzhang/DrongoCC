import { Color } from "cc";



/**
 * gui界面通用配置
 */
export class GUISettings {
    /**UI遮罩颜色值 */
    public static mask_color: Color = new Color(0, 0, 0, 255 * 0.5);
    /**UI开启蒙版点击时的提示 */
    public static closeTipCompURL: string | null;
}