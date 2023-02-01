import { EventDispatcher } from "../events/EventDispatcher";
import { ITask } from "./ITask";
/**
 * 任务队列
 */
export declare class TaskQueue extends EventDispatcher implements ITask {
    private __taskList;
    private __index;
    constructor();
    addTask(value: ITask): void;
    removeTask(value: ITask): void;
    start(data?: any): void;
    private __tryNext;
    private __subTaskEventHandler;
    destroy(): void;
}
