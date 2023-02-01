import { Dictionary } from "../drongo-cc";





export class Debuger {

    /**
     * 最大保存条数
     */
    static MaxCount: number = Number.MAX_SAFE_INTEGER;

    private static __logs: Dictionary<string, Array<string>> = new Dictionary<string, Array<string>>();


    private static __debuger: Map<string, boolean> = new Map<string, boolean>();

    /**
     * 设置过滤
     * @param key 
     * @param isOpen 
     */
    static debug(key: string, isOpen: boolean) {
        this.__debuger.set(key, isOpen);
    }

    /**
     * 获取已保存的日志
     * @param type 
     * @returns 
     */
    static getLogs(type?: string): Array<string> {
        if (type == undefined || type == null) {
            type = "all";
        }
        if (this.__logs.has(type)) {
            return this.__logs.get(type);
        }
        return null;
    }

    private static __save(type: string, logType: string, msg: string): string {
        let list: Array<string>;
        if (!this.__logs.has(type)) {
            list = [];
            this.__logs.set(type, list);
        } else {
            list = this.__logs.get(type);
        }
        let data: string = "[" + type + "]" + logType + ":" + msg;
        if (list.length >= this.MaxCount) {
            list.unshift();//删除最顶上的那条
        }
        list.push(data);
        //保存到all
        if (!this.__logs.has("all")) {
            list = [];
            this.__logs.set("all", list);
        } else {
            list = this.__logs.get("all");
        }
        if (list.length >= this.MaxCount) {
            list.unshift();//删除最顶上的那条
        }
        list.push(data);
        return data;
    }

    static log(type: string, msg: any): void {
        let data = this.__save(type, "Log", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.log(data);
        }
    }

    static err(type: string, msg: any) {
        let data = this.__save(type, "Error", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.error(data);
        }
    }

    static warn(type: string, msg: any) {
        let data = this.__save(type, "Warn", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.warn(data);
        }
    }

    static info(type: string, msg: any) {
        let data = this.__save(type, "Info", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.info(data);
        }
    }
}