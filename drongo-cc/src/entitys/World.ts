import { Dictionary } from "../containers/Dictionary";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { Group } from "./Group";
import { System } from "./System";



export class World {

    /**组件 */
    private __components: Dictionary<number, Array<Component>>;

    /**实体*/
    private __entitys: Dictionary<string, Entity>;

    /**系统*/
    private __systems: System[];

    constructor() {
        this.__components = new Dictionary<number, Array<Component>>();
        this.__entitys = new Dictionary<string, Entity>();
        this.__systems = [];
    }

    /**
     * 心跳驱动
     * @param time 
     */
    public tick(time: number): void {
        for (var system of this.__systems) {
            system.tick(time);
        }
    }

    /**
     * 创建一个实体
     */
    createEntity(id: string): Entity {
        let entity: Entity = new Entity(id, this);
        this.__entitys.set(entity.id, entity);
        return entity;
    }

    /**
     * 通过ID获取实体
     * @param id 
     */
    getEntity(id: string): Entity {
        return this.__entitys.get(id);
    }

    /**
     * 添加系统 
     */
    addSystem(value: System): void {
        let index: number = this.__systems.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加系统");
        }
        this.__systems.push(value);
        //按照编组规则匹配
        this._matcherGroup(value._group);
    }


    /**
     * 删除系统
     * @param value 
     */
    removeSystem(value: System): void {
        let index: number = this.__systems.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的系统");
        }
        this.__systems.splice(index, 1);
        //回收
        Group.recycle(value._group);
    }

    /**
     * 根据类型获取组件列表
     * @param type 
     */
    getComponent(type: number): Component[] {
        return this.__components.get(type);
    }

    //=====================================内部接口=======================================================//


    _matcherGroup(group: Group): void {
        let comList: Array<Component>;
        let minList: Array<Component>;
        //通过主匹配规则筛选出最短的
        for (let index = 0; index < group.matcher.elements.length; index++) {
            const type = group.matcher.elements[index];
            if (!comList) {
                continue;
            }
            comList = this.getComponent(type);
            if (minList == null) {
                minList = comList;
            } else {
                if (comList.length < minList.length) {
                    minList = comList;
                }
            }
        }
        if (!minList) {
            return;
        }
        //根据最少的组件数量来进行匹配
        let com: Component;
        for (let index = 0; index < minList.length; index++) {
            com = minList[index];
            if (com.entity._matcherGroup(group)) {
                group._entitys.set(com.entity.id, com.entity);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param com 
     */
    _addComponent(com: Component): void {
        let list: Component[] = this.__components.get(com.type);
        if (list == null) {
            list = [];
            this.__components.set(com.type, list);
        }
        let index: number = list.indexOf(com);
        if (index >= 0) {
            throw new Error("重复添加组件！");
        }
        list.push(com);
        for (let index = 0; index < this.__systems.length; index++) {
            const system = this.__systems[index];
            //已经在里面了，就不管这个组了
            if (system._group._entitys.has(com.entity.id)) {
                continue;
            }
            if (com.entity._matcherGroup(system._group)) {
                system._group._entitys.set(com.entity.id, com.entity);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param com 
     */
    _removeComponent(com: Component): void {
        let list: Component[] = this.__components.get(com.type);
        if (list == null) {
            return;
        }
        let index: number = list.indexOf(com);
        if (index < 0) {
            throw new Error("找不到要删除的组件");
        }
        list.splice(index, 0);
        for (let index = 0; index < this.__systems.length; index++) {
            const system = this.__systems[index];
            if (system._group._entitys.has(com.entity.id)) {
                system._group._entitys.delete(com.entity.id);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param value 
     */
    _removeEntity(value: Entity): void {
        if (!this.__entitys.has(value.id)) {
            throw new Error("找不到要删除的entity:" + value.id);
        }
        this.__entitys.delete(value.id);
    }
}