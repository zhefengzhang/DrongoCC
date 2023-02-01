import { EventDispatcher } from "../events/EventDispatcher";
import { ITask } from "./ITask";
/**
 * 任务序列（并行）
 */
export declare class TaskSequence extends EventDispatcher implements ITask {
    private __taskList;
    private __index;
    constructor();
    addTask(value: ITask): void;
    removeTask(value: ITask): void;
    start(data?: any): void;
    private __subTaskEventHandler;
    destroy(): void;
}