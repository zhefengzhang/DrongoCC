import { TickerManager } from "../ticker/TickerManager";

/**
 * 绑定信息
 */
export class BindInfo {
    /**
     * 属性KEY
     */
    property:string;
    /**
     * 目标或回调函数
     */
    targetOrCallBack: any | Function;
    /**
     * 目标属性或目标this引用
     */
    tPropertyOrCaller: string | any;
    
    constructor(property: string, targetOrCallBack: any | Function, tPropertyOrCaller: string | any) {
        this.property = property;
        this.targetOrCallBack = targetOrCallBack;
        this.tPropertyOrCaller = tPropertyOrCaller;
    }

    /**
     * 判断是否相等
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     * @returns 
     */
    equal(property: string, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): boolean {
        if (property == this.property && this.targetOrCallBack == targetOrCallBack && this.tPropertyOrCaller == tPropertyOrCaller) {
            return true;
        }
        return false;
    }
}

/**
 * 属性绑定器
 */
export class PropertyBinder {

    data: any;

    /**
     * 代理过的数据
     */
    private __propertys: Array<string>;

    /**
     * 属性改变列表
     */
    private __changedPropertys: Array<string>;

    private __bindedMap: Map<string, Array<BindInfo>>;

    private __bindedGroupMap: Map<string, Array<BindInfo>>;

    constructor(data: any) {
        this.data = data;

        this.__propertys = [];
        this.__changedPropertys = [];

        this.__bindedMap = new Map<string, Array<BindInfo>>();
        this.__bindedGroupMap = new Map<string, Array<BindInfo>>();
    }

    /**
     * 绑定
     * @param group 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     * @returns 
     */
    bind(group: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void {
        let info: BindInfo;
        let groupList: Array<BindInfo> = this.__bindedGroupMap.get(group);
        if (!groupList) {
            groupList = [];
            this.__bindedGroupMap.set(group, groupList);
        }
        let exist: boolean = false;
        let bindInfos: Array<BindInfo>;
        if (Array.isArray(property)) {
            for (let pIndex = 0; pIndex < property.length; pIndex++) {
                const propertyKey = property[pIndex];
                this.__checkProperty(propertyKey);

                for (let index = 0; index < groupList.length; index++) {
                    info = groupList[index];
                    if (info.equal(propertyKey, targetOrCallBack, tPropertyOrCaller)) {
                        exist = true;
                        continue;
                    }
                }
                //不存在
                if (!exist) {
                    info = new BindInfo(propertyKey, targetOrCallBack, tPropertyOrCaller);
                    bindInfos = this.__bindedMap.get(propertyKey);
                    if (!bindInfos) {
                        bindInfos = [];
                        this.__bindedMap.set(propertyKey, bindInfos);
                    }
                    bindInfos.push(info);
                    groupList.push(info);

                    //标记改变
                    this.__propertyChanged(propertyKey);
                }
            }
        } else {
            this.__checkProperty(property);

            for (let index = 0; index < groupList.length; index++) {
                info = groupList[index];
                if (info.equal(property, targetOrCallBack, tPropertyOrCaller)) {
                    return;
                }
            }
            info = new BindInfo(property, targetOrCallBack, tPropertyOrCaller);
            bindInfos = this.__bindedMap.get(property);
            if (!bindInfos) {
                bindInfos = [];
                this.__bindedMap.set(property, bindInfos);
            }
            bindInfos.push(info);
            groupList.push(info);

            //标记改变
            this.__propertyChanged(property);
        }
    }

    /**
     * 取消绑定
     * @param group 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     * @returns 
     */
    unbind(group: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void {
        let info: BindInfo;
        let groupList: Array<BindInfo> = this.__bindedGroupMap.get(group);
        //如果记录中没有
        if (!groupList) {
            return;
        }
        let bindInfos: Array<BindInfo>;
        let fIndex: number;
        //取消所有该组的绑定
        if (property == null) {
            for (let index = 0; index < groupList.length; index++) {
                info = groupList[index];
                //从已绑定的列表中删除
                bindInfos = this.__bindedMap.get(info.property);
                if (bindInfos && bindInfos.length > 0) {
                    fIndex = bindInfos.indexOf(info);
                    if (fIndex >= 0) {
                        bindInfos.splice(fIndex, 1);
                    }
                }
                if (bindInfos.length == 0) {
                    this.__bindedMap.delete(info.property);
                }
            }
            groupList.length = 0;
            this.__bindedGroupMap.delete(group);
            return;
        }
        if (Array.isArray(property)) {
            for (let pIndex = 0; pIndex < property.length; pIndex++) {
                const propertyKey = property[pIndex];
                //从组中找相对比较快一些，因为编组列表相对数据绑定列表通常会小一些
                for (let gIndex = 0; gIndex < groupList.length; gIndex++) {
                    info = groupList[gIndex];
                    bindInfos = this.__bindedMap.get(info.property);
                    if (info.equal(propertyKey, targetOrCallBack, tPropertyOrCaller)) {
                        fIndex = bindInfos.indexOf(info);
                        if (fIndex >= 0) {
                            bindInfos.splice(fIndex, 1);
                        }
                        groupList.splice(gIndex, 1);
                        gIndex--;
                    }
                }
            }
            if (groupList.length == 0) {
                this.__bindedGroupMap.delete(group);
            }
        } else {
            //从组中找相对比较快一些，因为编组列表相对数据绑定列表通常会小一些
            for (let gIndex = 0; gIndex < groupList.length; gIndex++) {
                info = groupList[gIndex];
                bindInfos = this.__bindedMap.get(info.property);
                if (info.equal(property, targetOrCallBack, tPropertyOrCaller)) {
                    fIndex = bindInfos.indexOf(info);
                    if (fIndex >= 0) {
                        bindInfos.splice(fIndex, 1);
                    }
                    groupList.splice(gIndex, 1);
                    gIndex--;
                }
            }
            if (groupList.length == 0) {
                this.__bindedGroupMap.delete(group);
            }
        }
    }



    //========================================属性绑定机制实现======================================//

    /**
    * 检测属性
    * @param propertyKey 
    */
    private __checkProperty(propertyKey: string): void {
        let index: number = this.__propertys.indexOf(propertyKey);
        //如果没有绑定过这个数据
        if (index < 0) {
            //数据绑定实现
            let value: any = this.data[propertyKey];
            this.__defineReactive(this.data, propertyKey, value);
            this.__propertys.push(propertyKey);
        }
    }

    /**定义 */
    private __defineReactive(data: any, key: string, value: any): void {
        let self = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function (): any {
                return value;
            },
            set: function (newValue: any) {
                if (value == newValue) {
                    return;
                }
                // console.log("绑定数据改变：", value, newValue);
                value = newValue;
                self.__propertyChanged(key);
            },
        })
    }

    private __propertyChanged(pKey: string, isInit: boolean = false): void {
        //标记改变
        if (this.__changedPropertys.indexOf(pKey) < 0) {
            this.__changedPropertys.push(pKey);
            TickerManager.callNextFrame(this.__nextFramePropertyUpdate, this);
        }
    }

    private __nextFramePropertyUpdate(isInit: boolean = false): void {
        let pKey: string;
        for (let propsIndex = 0; propsIndex < this.__changedPropertys.length; propsIndex++) {
            pKey = this.__changedPropertys[propsIndex];
            this.__updateProperty(pKey);
        }
        this.__changedPropertys.length = 0;
    }

    /**
     * 属性更新
     * @param pKey 
     */
    private __updateProperty(pKey: string): void {
        let bindInfos: Array<BindInfo> = this.__bindedMap.get(pKey);
        let info: BindInfo;
        if (bindInfos && bindInfos.length) {
            for (let index = 0; index < bindInfos.length; index++) {
                info = bindInfos[index];
                //属性绑定
                if (typeof info.targetOrCallBack != "function") {
                    info.targetOrCallBack[info.tPropertyOrCaller] = this.data[pKey];
                } else {//函数绑定
                    info.targetOrCallBack.apply(info.tPropertyOrCaller, this.__changedPropertys);
                }
            }
        }
    }
}
