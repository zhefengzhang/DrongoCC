import { Handler } from "../utils/Handler";
import { FunctionHook } from "./FunctionHook";
import { PropertyBinder } from "./PropertyBinder";

/**
 * 属性与属性数据
 */
export interface BindAAInfo {
    /**
     * 数据源对象
     */
    source: any;
    /**
     * 数据源属性名
     */
    property: string;
    /**
     * 目标对象
     */
    target: any;
    /**
     * 目标属性名
     */
    targetProperty: string;
}

/**
 * 属性与方法绑定
 */
export interface BindAMInfo {
    /**
     * 数据源对象
     */
    source: any;
    /**
     * 数据源属性名
     */
    property: string|Array<string>;
    /**
     * 数据属性改变时回调函数
     */
    callback: Function;
    caller: any; 
}

/**
 * 方法与方法绑定信息
 */
export interface BindMMInfo{
    source:any;
    functionName:string;
    preHandler:Handler;
    laterHandler:Handler;
}

/**
 * 绑定工具类
 */
export class BindingUtils {
    
    /**属性绑定记录 */
    private __bindRecords: Array<BindAAInfo|BindAMInfo>;
    /**方法绑定记录 */
    private __hookRecords: Array<BindMMInfo>;
    
    constructor(){
        this.__bindRecords=[];
        this.__hookRecords=[];
    }

    private __bind(value:BindAAInfo|BindAMInfo):void{
        
    }

    private __unbind(value:BindAAInfo|BindAMInfo):void{

    }

    bindAA(value:BindAAInfo|BindAMInfo): void {
        this.__bind(value);
    }

    unbindAA(value:BindAAInfo|BindAMInfo):void{
        this.__unbind(value);
    }
}