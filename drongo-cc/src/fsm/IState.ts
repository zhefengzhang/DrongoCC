import { FSM } from "./FSM";



    /**
     * 状态接口
     */
    export interface IState {
        name: string;
        /**初始化 */
        init(content: FSM): void;
        /**进入 */
        enter(data?:any): void;
        /**心跳 */
        tick(dt: number): void;
        /**退出 */
        exit(): void;
        /**销毁 */
        destroy():void;
    }