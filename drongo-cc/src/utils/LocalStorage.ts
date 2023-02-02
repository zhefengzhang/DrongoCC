import { sys } from "cc";


/**
 * 本地数据缓存
 */
export class LocalStorage{

    private static __gameName:string;

    private static data:any;

    /**
     * 初始化
     * @param gameName 
     */
    static init(gameName:string):void{
        this.__gameName=gameName;
        let localDataStr: string = sys.localStorage.getItem(this.__gameName);
        if (!localDataStr) {
            this.data={};
        }else{
            this.data=JSON.parse(localDataStr);
        }
    }

    /**
     * 获取指定数据
     * @param key 
     * @returns 
     */
    static getItem(key:string):any{
        return this.data[key];
    }

    /**
     * 设置指定数据
     * @param key 
     * @param value 
     */
    static setItem(key:string,value:any):void{
        this.data[key]=value;
    }


    /**
     * 清理
     * @param key 
     */
    static clearItem(key:string):void{
        delete this.data[key];
    }

    /**
     * 清理所有
     */
    static clearAll():void{
        this.data={};
    }

    /**
     * 保存
     */
    static save():void{
        //保存到本地
        let localDataStr: string=JSON.stringify(this.data);
        sys.localStorage.setItem(this.__gameName,localDataStr);
    }
}