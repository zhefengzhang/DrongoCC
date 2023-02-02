import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { ITimer } from "./ITimer";

export class TimerImpl implements ITimer,ITicker{
        
    private __lastTime:number=0;

    constructor(){
        this.reset();
        TickerManager.addTicker(this);
    }

    reset(): void {
       //当前时间转秒
       this.__lastTime=Date.now()/1000;
    }

    tick(dt: number): void {
        this.__lastTime+=dt;
    }

    get currentTime():number{
        return this.__lastTime;
    }

    get absTime():number{
        this.reset();
        return this.currentTime;
    }
}