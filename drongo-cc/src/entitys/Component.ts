import { Entity } from "./Entity";



export class Component {

    /**
     * 所属实体
     */
    public entity: Entity;

    /**
     * 类型
     */
    public get type(): number {
        return 0;
    }

    public dispose(): void {
        
    }
}