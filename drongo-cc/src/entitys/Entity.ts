import { Dictionary } from "../containers/Dictionary";
import { MatcherAllOf } from "../drongo-cc";
import { BitFlag } from "../utils/BitFlag";
import { Component } from "./Component";
import { Group } from "./Group";
import { World } from "./World";




export class Entity {

    private __components: Dictionary<number, Array<Component>>;

    private __world: World;

    private __id: string;

    private __componentFlags: BitFlag;

    constructor(id: string, world: World) {
        this.__id = id;
        this.__world = world;
        this.__components = new Dictionary<number, Array<Component>>();
        this.__componentFlags = new BitFlag();
    }
    
    /**
     * 添加组件
     * @param value
     */
    addComponent(value: Component): Component {
        let list: Array<Component> = this.__components.get(value.type);
        if (list) {
            let index: number = list.indexOf(value);
            if (index >= 0) {
                throw new Error("重复添加Component到Entity");
            }
        } else {
            list = [];
            this.__components.set(value.type, list);
        }
        let world: boolean = true;
        //如果已经在实体上
        if (value.entity) {
            value.entity.__removeComponent(value, false);
            world = false;
        }
        value.entity = this;
        list.push(value);
        this.__componentFlags.add(value.type);
        if (world) {
            this.__world._addComponent(value);
        }
        return value;
    }

    /**
     * 删除组件
     * @param id 
     */
    removeComponent(value: Component): void {
        this.__removeComponent(value, true);
    }

    /**
     * 获取组件
     * @param type 
     */
    getComponent(type: number): Component {
        let list: Array<Component> = this.__components.get(type);
        if (list && list.length > 0) {
            return list[0];
        }
        return null;
    }

    /**
     * 获取组件列表
     * @param type 
     * @returns 
     */
    getComponents(type: number): Array<Component> {
        return this.__components.get(type);
    }

    private __removeComponent(value: Component, world: boolean): void {
        let list: Array<Component> = this.__components.get(value.type);
        if (list == null && list.length == 0) {
            throw new Error("该组件不是属于Entity:" + this.__id);
        }
        let index: number = list.indexOf(value);
        if (index < 0) {
            throw new Error("该组件不是属于Entity:" + this.__id);
        }
        this.__componentFlags.remove(value.type);
        if (world) {
            this.__world._removeComponent(value);
        }
        list.splice(index, 1);
        value.entity = null;
    }

    /**
     * 唯一ID
     */
    get id(): string {
        return this.__id;
    }

    /**
     * 销毁
     */
    dispose(): void {
        //从世界中删除组件记录
        let components: Array<Array<Component>> = this.__components.elements;
        let comList: Array<Component>;
        let com: Component;
        for (let index = 0; index < components.length; index++) {
            comList = components[index];
            for (let index = 0; index < comList.length; index++) {
                com = comList[index];
                this.__world._removeComponent(com);
            }
        }
        this.__world._removeEntity(this);
        this.__components = null;
        this.__world = null;
        this.__componentFlags.destroy();
        this.__componentFlags = null;
    }

    /**
     * 是否符合匹配规则
     * @param group 
     */
    _matcherGroup(group: Group): boolean {
        let mainMatcher: boolean = false;
        if (group.matcher instanceof MatcherAllOf) {
            if (this.__componentFlags.has(group.matcher.flags)) {
                mainMatcher = true;
            }
        } else {
            if (this.__componentFlags.flags & group.matcher.flags) {
                mainMatcher = true;
            }
        }
        let noneMatcher: boolean = true;
        if (group.matcherNoneOf) {
            if (this.__componentFlags.flags & group.matcherNoneOf.flags) {
                noneMatcher = false;
            }
        }
        return mainMatcher && noneMatcher;
    }
}