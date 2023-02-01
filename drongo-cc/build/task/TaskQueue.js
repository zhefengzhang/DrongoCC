import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
/**
 * 任务队列
 */
export class TaskQueue extends EventDispatcher {
    constructor() {
        super();
        this.__index = 0;
        this.__taskList = [];
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
            throw new Error("未找到要删除的内容！");
        }
        this.__taskList.splice(index, 1);
    }
    start(data) {
        this.__index = 0;
        this.__tryNext();
    }
    __tryNext() {
        if (this.__index < this.__taskList.length) {
            let task = this.__taskList[this.__index];
            task.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            task.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            task.on(Event.ERROR, this.__subTaskEventHandler, this);
            task.start();
        }
        else {
            //结束
            this.emit(Event.COMPLETE);
        }
    }
    __subTaskEventHandler(key, target, data) {
        if (key == Event.PROGRESS) {
            let dataValue = Number(data) == undefined ? 0 : Number(data);
            let progress = (this.__index + dataValue) / this.__taskList.length;
            this.emit(Event.PROGRESS, progress);
            return;
        }
        target.offAllEvent();
        if (key == Event.ERROR) {
            this.emit(Event.ERROR, data);
            return;
        }
        target.destroy();
        this.__index++;
        this.__tryNext();
    }
    destroy() {
        super.destroy();
        this.__taskList.length = 0;
        this.__index = 0;
    }
}
