import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 任务序列（并行）
 */
export class TaskSequence extends EventDispatcher {
    constructor() {
        super();
        this.__taskList = new Array();
        this.__index = 0;
    }
    addTask(value) {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }
    removeTask(value) {
        let index = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的内容!");
        }
        this.__taskList.splice(index, 1);
    }
    start(data) {
        for (let index = 0; index < this.__taskList.length; index++) {
            const element = this.__taskList[index];
            element.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            element.on(Event.ERROR, this.__subTaskEventHandler, this);
            element.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            element.start();
        }
    }
    __subTaskEventHandler(type, target, data) {
        if (type == Event.PROGRESS) {
            this.emit(Event.PROGRESS, this.__index / this.__taskList.length);
            return;
        }
        target.offAllEvent();
        if (type == Event.ERROR) {
            this.emit(Event.ERROR, data);
            return;
        }
        this.__index++;
        if (this.__index < this.__taskList.length) {
            return;
        }
        target.destroy();
        //完成
        this.emit(Event.COMPLETE);
    }
    destroy() {
        super.destroy();
        this.__taskList.length = 0;
        this.__index = 0;
    }
}
