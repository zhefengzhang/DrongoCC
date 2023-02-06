import { Component, Node } from "cc";
import { Event, GUIManager, IGUIMediator, ILayer, IViewCreator, LayerManager, LoadingView, Res, ResRef, ResURL, Timer, url2Key } from "drongo-cc";
import { IGUIInfo } from "./IGUIInfo";



enum LoadState {
    Null,
    Loading,
    Loaded
}

/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
export class GUIProxy {

    /**用于Creator创建器的统一帮助节点 */
    private static createNode: Node = new Node("createHelpNode");

    info?: IGUIInfo;

    /**GUI中介*/
    mediator?: IGUIMediator;

    /**关闭时间*/
    closeTime: number = 0;

    /**UI层次*/
    zIndex: number = 0;

    /**数据 */
    data: any;

    /**资源引用*/
    private __resRef: ResRef | null = null;

    /**是否在显示中*/
    private __showing: boolean = false;

    /**加载状态 */
    private __loadState: LoadState = LoadState.Null;

    private __uiURL: ResURL;

    private __startTime: number;

    constructor(info: IGUIInfo) {
        this.info = info;
        if (!this.info) {
            throw new Error("UI信息不能为空！");
        }
        this.__uiURL = { url: "ui/" + this.info.packageName, type: "fgui", bundle: this.info.bundleName };
    }

    //加载UI资源
    private __loadAssets(): void {
        this.__startTime = Timer.currentTime;
        this.__loadState = LoadState.Loading;
        Res.getResRef(this.__uiURL, this.info.uiName, this.__loadAssetProgress.bind(this)).then(
            this.__loadAssetComplete.bind(this), this.__loadAssetError.bind(this)
        );
    }

    private __loadAssetProgress(progress: number): void {
        LoadingView.changeData({ label: this.info.uiName + " asset loading...", progress: progress })
    }

    private __loadAssetError(err: any): void {
        if (err) {
            LoadingView.changeData({ label: err.message });
        }
    }

    private __loadAssetComplete(result: ResRef): void {
        let resKey: string = url2Key(this.__uiURL);
        if (resKey != result.key) {
            result.dispose();
            return;
        }
        //资源是否存在
        this.__resRef = result;
        if (!this.__resRef) {
            throw new Error("加载UI资源失败:" + this.info.packageName + " ");
        }
        let viewCreatorCom: Component = GUIProxy.createNode.addComponent(this.info.uiName + "Mediator");
        let viewCreator: IViewCreator = <unknown>viewCreatorCom as IViewCreator;
        if (!viewCreator) {
            throw new Error(this.info.uiName + "_ViewCreator类不存在或未实现IViewCreator!");
        }

        this.mediator = viewCreator.createMediator();

        //销毁
        GUIProxy.createNode.removeComponent(viewCreatorCom);
        viewCreatorCom.destroy();

        this.__loadState = LoadState.Loaded;

        this.mediator!.createUI(this.info, this.__createUICallBack.bind(this));
    }

    /**
     * UI创建完成回调
     */
    private __createUICallBack(): void {
        this.mediator!.init();
        this.mediator.inited = true;
        if (this.__showing) {
            this.__show();
        }
    }

    private __addToLayer(): void {
        this.layer.addChildAt(this.mediator!.viewComponent, this.zIndex);
        this.mediator!.viewComponent!.visible = true;
    }

    tick(dt: number): void {
        if (this.__loadState == LoadState.Loading) {
            let currentTime = Timer.currentTime;
            if (currentTime - this.__startTime > 1) {
                LoadingView.show();
            }
            return;
        }
        if (this.__loadState == LoadState.Loaded) {
            if (this.mediator) {
                this.mediator.tick(dt);
            }
        }
    }

    show(data?: any): void {
        this.__showing = true;
        this.zIndex = this.getLayerChildCount();
        this.data = data;
        this.__show();
    }

    showedUpdate(data: any): void {
        if (this.mediator && this.__showing) {
            this.mediator.showedUpdate(data);
        }
    }

    private __show(): void {
        if (this.__loadState == LoadState.Null) {
            this.__loadAssets();
        } else if (this.__loadState == LoadState.Loading) {
            //加载中啥也不干
        } else {
            this.__addToLayer();
            LoadingView.hide();
            this.mediator!.show(this.data);
            this.data = null;
            //如果界面已经被关闭(这是有可能的！);
            if (!GUIManager.isOpen(this.info.key)) {
                return;
            }
            if (this.mediator.playShowAnimation) {
                this.mediator.playShowAnimation(this.__showAnimationPlayed);
            } else {
                Event.emit(Event.SHOW, this.info!.key);
            }
        }
    }

    private __showAnimationPlayed(): void {
        Event.emit(Event.SHOW, this.info!.key);
    }

    hide(): void {
        if (this.__loadState == LoadState.Loading) {
            this.__loadState = LoadState.Null;
        } else if (this.__loadState == LoadState.Loaded) {
            //如果在显示中
            if (this.__showing) {
                if (this.mediator.playHideAnimation) {
                    this.mediator.playHideAnimation(this.__hideAnimationPlayed);
                } else {
                    this.__hide();
                }
            }
        }
    }

    private __hideAnimationPlayed(): void {
        if (this.__showing) {
            this.__hide();
        }
    }

    private __hide(): void {
        this.mediator!.viewComponent!.visible = false;
        this.mediator!.hide();
        this.__showing = false;
        Event.emit(Event.HIDE, this.info!.key);
    }

    destroy(): void {
        console.log("UI销毁=>" + this.info?.key);
        this.mediator!.destroy();
        this.mediator = undefined;
        this.info = undefined;
        this.data = null;
        if (this.__resRef) {
            this.__resRef.dispose();
            this.__resRef = null;
        }
    }

    private getLayerChildCount(): number {
        return this.layer.getCount();
    }

    private get layer(): ILayer {
        let l: ILayer | undefined = LayerManager.getLayer(this.info!.layer);
        if (l === undefined) {
            throw new Error("layer：" + this.info!.layer + "不存在！");
        }
        return l;
    }

    /**
     * 获取组件
     * @param path 
     */
    getComponent(path: string): any {
        if (!this.mediator) {
            return null;
        }
        return this.mediator.getUIComponent(path);
    }
}
