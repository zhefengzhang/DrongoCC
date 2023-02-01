import { Dictionary } from "../drongo-cc";
export class Debuger {
    /**
     * 设置过滤
     * @param key
     * @param isOpen
     */
    static debug(key, isOpen) {
        this.__debuger.set(key, isOpen);
    }
    /**
     * 获取已保存的日志
     * @param type
     * @returns
     */
    static getLogs(type) {
        if (type == undefined || type == null) {
            type = "all";
        }
        if (this.__logs.has(type)) {
            return this.__logs.get(type);
        }
        return null;
    }
    static __save(type, logType, msg) {
        let list;
        if (!this.__logs.has(type)) {
            list = [];
            this.__logs.set(type, list);
        }
        else {
            list = this.__logs.get(type);
        }
        let data = "[" + type + "]" + logType + ":" + msg;
        if (list.length >= this.MaxCount) {
            list.unshift(); //删除最顶上的那条
        }
        list.push(data);
        //保存到all
        if (!this.__logs.has("all")) {
            list = [];
            this.__logs.set("all", list);
        }
        else {
            list = this.__logs.get("all");
        }
        if (list.length >= this.MaxCount) {
            list.unshift(); //删除最顶上的那条
        }
        list.push(data);
        return data;
    }
    static log(type, msg) {
        let data = this.__save(type, "Log", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.log(data);
        }
    }
    static err(type, msg) {
        let data = this.__save(type, "Error", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.error(data);
        }
    }
    static warn(type, msg) {
        let data = this.__save(type, "Warn", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.warn(data);
        }
    }
    static info(type, msg) {
        let data = this.__save(type, "Info", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.info(data);
        }
    }
}
/**
 * 最大保存条数
 */
Debuger.MaxCount = Number.MAX_SAFE_INTEGER;
Debuger.__logs = new Dictionary();
Debuger.__debuger = new Map();
