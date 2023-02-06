import { Injector } from "../../drongo-cc";
import { ILoadingData } from "./ILoadingData";
import { ILoadingView } from "./ILoadingView";



/**
 * 加载界面
 */
export class LoadingView {
    static KEY: string = "drongo.LoadingView";

    static show(): void {
        this.impl.show();
    }

    static hide(): void {
        this.impl.hide();
    }

    static changeData(data: ILoadingData): void {
        this.impl.changeData(data);
    }

    private static __impl: ILoadingView;
    static get impl(): ILoadingView {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "为注入");
        }
        return this.__impl;
    }
}