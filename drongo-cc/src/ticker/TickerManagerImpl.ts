import { Component, director, find, Node } from "cc";
import { ITicker } from "./ITicker";
import { ITickerManager } from "./ITickerManager";


/**
 * 默认的ticker管理器实现
 */
export class TickerManagerImpl implements ITickerManager {

    private __tickerRoot: Node;
    private __tickerManager: ITickerManager;
    constructor() {
        this.__tickerRoot = find("TickerManager");
        if(!this.__tickerRoot){
            this.__tickerRoot = new Node("TickerManager");
            director.getScene().addChild(this.__tickerRoot);
        }
        this.__tickerManager = this.__tickerRoot.addComponent(TickManagerComponent);
    }
    
    addTicker(value: ITicker): void {
        this.__tickerManager.addTicker(value);
    }

    removeTicker(value: ITicker): void {
        this.__tickerManager.removeTicker(value);
    }

    callNextFrame(value: Function, caller: any): void {
        this.__tickerManager.callNextFrame(value, caller);
    }

    clearNextFrame(value: Function, caller: any): void {
        this.__tickerManager.clearNextFrame(value, caller);
    }
}

class TickManagerComponent extends Component implements ITickerManager {

    private __tickerList: Array<ITicker> = []

    private __nextFrameCallBacks: Array<NextFrameHandler> = [];

    update(dt: number): void {
        let handler: NextFrameHandler;
        while (this.__nextFrameCallBacks.length) {
            handler = this.__nextFrameCallBacks.shift()!;
            handler.callBack.apply(handler.caller);
        }
        for (let index = 0; index < this.__tickerList.length; index++) {
            const element = this.__tickerList[index];
            element.tick(dt);
        }
    }

    addTicker(value: ITicker): void {
        let index: number = this.__tickerList.indexOf(value);
        if (index >= 0) {
            throw new Error("Ticker 重复添加！");
        }
        this.__tickerList.push(value);
    }

    removeTicker(value: ITicker): void {
        let index: number = this.__tickerList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的Tick！");
        }
        this.__tickerList.splice(index, 1);
    }

    callNextFrame(value: Function, caller: any): void {
        for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
            const element = this.__nextFrameCallBacks[index];
            //重复
            if (element.equal(value, caller)) {
                return;
            }
        }
        this.__nextFrameCallBacks.push(new NextFrameHandler(value, caller));
    }

    clearNextFrame(value: Function, caller: any): void {
        for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
            const element = this.__nextFrameCallBacks[index];
            //删除
            if (element.equal(value, caller)) {
                this.__nextFrameCallBacks.splice(index, 1);
            }
        }
    }
}

class NextFrameHandler {
    callBack: Function;
    caller: any;

    constructor(callBack: Function, caller: any) {
        this.callBack = callBack;
        this.caller = caller;
    }

    equal(callBack: Function, caller: any): boolean {
        if (this.caller !== caller) {
            return false;
        }
        if (this.callBack !== callBack) {
            return false;
        }
        return true;
    }
}