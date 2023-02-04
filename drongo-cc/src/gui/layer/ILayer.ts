
export interface ILayer {
    addChild(child: any): void;

    addChildAt(child: any, index: number): void;

    removeChild(child: any): void;

    removeChildAt(index: number): void;

    /**
     * 获取指定索引内容
     * @param index 
     */
    getChildAt(index:number):any;

    /**
     * 当前层拥有的子对象数量
     */
    getCount(): number;
}