import { Handler } from "../utils/Handler";


/**
 * 函数钩子信息
 */
export class FunctionHookInfo {
    /**
     * 方法名
     */
    functionName: string;
    /**
     * 前置处理器
     */
    preHandler: Handler;
    /**
     * 后置处理器
     */
    laterHandler: Handler;

    equal(functionName: string, preHandler: Handler, laterHandler: Handler): boolean {
        if (this.functionName != functionName) {
            return false;
        }
        if (!preHandler.equal(this.preHandler)) {
            return false;
        }
        if (!laterHandler.equal(this.laterHandler)) {
            return false;
        }
        return true;
    }
}


export class FunctionHook {

    data: any;

    /**
     * 已添加好钩子的方法
     */
    private __functions: Array<string>;

    private __preHandlerMap: Map<string, Array<Handler>>;
    private __laterHandlerMap: Map<string, Array<Handler>>;

    private __groupMap: Map<any, Array<FunctionHookInfo>>;

    constructor(data: any) {
        this.data = data;
        this.__functions = [];
        this.__preHandlerMap = new Map<string, Array<Handler>>();
        this.__laterHandlerMap = new Map<string, Array<Handler>>();
        this.__groupMap = new Map<any, Array<FunctionHookInfo>>();
    }

    /**
     * 添加钩子
     * @param group
     * @param functionName 
     * @param preHandlers 
     * @param laterHandlers 
     */
    addHook(group: any, functionName: string, preHandler: Handler, laterHandler: Handler): void {
        let groupList: Array<FunctionHookInfo> = this.__groupMap.get(group);
        if (!groupList) {
            groupList = [];
            this.__groupMap.set(group, groupList);
        }
        for (let index = 0; index < groupList.length; index++) {
            const element = groupList[index];
            if (element.equal(functionName, preHandler, laterHandler)) {
                //重复添加
                return;
            }
        }
        let info: FunctionHookInfo = new FunctionHookInfo();
        info.functionName = functionName;
        info.preHandler = preHandler;
        info.laterHandler = laterHandler;

        groupList.push(info);

        //如果没有添加好钩子
        if (this.__functions.indexOf(functionName) < 0) {
            let oldFun: Function = this.data[functionName];
            if (!oldFun) {
                throw new Error("方法不存在！");
            }
            let pres: Array<Handler> = this.__preHandlerMap.get(functionName);
            if (!pres) {
                pres = [];
                this.__preHandlerMap.set(functionName, pres);
            }
            let laters: Array<Handler> = this.__laterHandlerMap.get(functionName);
            if (!laters) {
                laters = [];
                this.__laterHandlerMap.set(functionName, laters);
            }
            let newFun: Function = function (...arg:any[]): void {
                //pre
                if (pres && pres.length) {
                    for (let index = 0; index < pres.length; index++) {
                        const element = pres[index];
                        element.run(arg);
                    }
                }
                //old
                oldFun(arg);
                //later
                if (laters && laters.length) {
                    for (let index = 0; index < laters.length; index++) {
                        const element = laters[index];
                        element.run(arg);
                    }
                }
            }
            this.data[functionName] = newFun;
            this.data["old_" + functionName] = oldFun;
            this.__functions.push(functionName);
        }
        let pres: Array<Handler> = this.__preHandlerMap.get(functionName);
        if (!pres) {
            pres = [];
            this.__preHandlerMap.set(functionName, pres);
        }
        if (pres.indexOf(preHandler) < 0) {
            pres.push(preHandler);
        }

        let laters: Array<Handler> = this.__laterHandlerMap.get(functionName);
        if (!laters) {
            laters = [];
            this.__laterHandlerMap.set(functionName, laters);
        }
        if (laters.indexOf(laterHandler) < 0) {
            laters.push(laterHandler);
        }
    }

    /**
     * 删除钩子
     * @param group 
     * @param functionName
     * @param preHandler 
     * @param laterHandler 
     * @returns 
     */
    removeHook(group: any, functionName?: string, preHandler?: Handler, laterHandler?: Handler): void {
        let groupList: Array<FunctionHookInfo> = this.__groupMap.get(group);
        if (!groupList) {
            return;
        }
        let list: Array<Handler>;
        let fIndex: number;

        //编组删除
        if (!functionName) {
            for (let index = 0; index < groupList.length; index++) {
                const element = groupList[index];
                //pre
                if (element.preHandler) {
                    list = this.__preHandlerMap.get(element.functionName);
                    fIndex = list.indexOf(element.preHandler);
                    if (fIndex >= 0) {
                        list.splice(fIndex, 1);
                    }
                    if (list.length == 0) {
                        this.__preHandlerMap.delete(element.functionName);
                    }
                }
                //later
                if (element.laterHandler) {
                    list = this.__laterHandlerMap.get(element.functionName);
                    fIndex = list.indexOf(element.laterHandler);
                    if (fIndex >= 0) {
                        list.splice(fIndex, 1);
                    }
                    if (list.length == 0) {
                        this.__laterHandlerMap.delete(element.functionName);
                    }
                }
            }
            groupList.length = 0;
            this.__groupMap.delete(group);
            return;
        }

        for (let index = 0; index < groupList.length; index++) {
            const element = groupList[index];
            if (element.equal(functionName, preHandler, laterHandler)) {
                //删除
                groupList.splice(index, 1);
                //pre
                if (element.preHandler) {
                    list = this.__preHandlerMap.get(functionName);
                    fIndex = list.indexOf(element.preHandler);
                    if (fIndex >= 0) {
                        list.splice(fIndex, 1);
                    }
                }
                //later
                if (element.laterHandler) {
                    list = this.__laterHandlerMap.get(functionName);
                    fIndex = list.indexOf(element.laterHandler);
                    if (fIndex >= 0) {
                        list.splice(fIndex, 1);
                    }
                }
                return;
            }
        }
    }
}