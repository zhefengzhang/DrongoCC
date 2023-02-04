import { IRelationList } from "./IRelationList";



/**
 * UI关联数据
 */
export interface IRelationInfo {
    /**
     * 显示时的关联
     */
    show: IRelationList;
    /**
     * 隐藏时的关联
     */
    hide: IRelationList;
}