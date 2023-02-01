import { EventDispatcher } from "../events/EventDispatcher";
import { IState } from "./IState";
/**
 * 状态机
 */
export declare class FSM extends EventDispatcher {
    /**所属*/
    owner: any;
    debug: boolean;
    private __current;
    private __state;
    private __states;
    private __name;
    constructor(owner: any, name: string);
    tick(dt: number): void;
    /**
     * 添加
     * @param key
     * @param v
     */
    addState(key: number, v: IState): void;
    /**
     * 切换状态
     * @param value
     * @param data
     * @returns
     */
    switchState(value: number, data?: any): void;
    get state(): number;
    get current(): IState;
    destroy(): void;
}
