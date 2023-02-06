import { IGUIMediator } from "./IGUIMediator";



/**
 * View创建者
 */
export interface IViewCreator
{
    /**
     * 创建Mediator
     */
    createMediator():IGUIMediator;
}