import { Color } from "cc";
import { GUIManager, IGUIMediator } from "drongo-cc";
import { AsyncOperation, GComponent, GGraph, GObject, RelationType, UIPackage } from "drongo-fgui";
import { BaseMediator } from "./BaseMediator";
import { GUISettings } from "./GUISettings";
import { IGUIInfo } from "./IGUIInfo";
import { SubGUIMediator } from "./SubGUIMediator";


/**
 * UI中介者
 */
export class GUIMediator extends BaseMediator implements IGUIMediator {
    /**根节点 */
    viewComponent: GComponent | null = null;


    info: IGUIInfo | null = null;

    /**遮罩 */
    private __mask: GGraph | null = null;

    /**创建UI完成回调*/
    private __createdCallBack: Function;

    /**
     * 子UI
     */
    protected $subMediators: Array<SubGUIMediator> = [];

    constructor() {
        super();
    }

    /**
     * 创建UI
     * @param info 
     * @param created 
     */
    createUI(info: any, created: Function): void {
        this.info = info;
        if (this.info == null) {
            throw new Error("GUI 信息不能为空");
        }
        this.__createdCallBack = created;
        this.__createUI(true);
    }

    private __asyncCreator: AsyncOperation
    private __createUI(async: boolean): void {
        let packageName: string = this.info.packageName;
        if (async) {
            this.__asyncCreator = new AsyncOperation();
            this.__asyncCreator.callback = this.__uiCreated.bind(this);
            this.__asyncCreator.createObject(packageName, this.info!.comName);
        } else {
            try {
                let ui: GObject = UIPackage.createObject(packageName, this.info!.comName);
                this.__uiCreated(ui);
            } catch (err) {
                throw new Error("创建界面失败：" + this.info!.packageName + " " + this.info!.comName);
            }
        }
    }

    private __uiCreated(ui: GObject): void {
        let uiCom: GComponent = ui.asCom;
        uiCom.makeFullScreen();
        //如果需要遮罩
        if (this.info!.modal) {
            this.ui = uiCom;
            this.viewComponent = new GComponent();
            this.viewComponent.makeFullScreen();

            this.__mask = new GGraph();
            this.__mask.makeFullScreen();

            this.__mask.drawRect(0, Color.BLACK, GUISettings.mask_color);

            this.viewComponent.addChild(this.__mask);
            if (this.info!.modalClose) {
                this.__mask.onClick(this._maskClickHandler, this);

                //点击背景关闭提示
                if (GUISettings.closeTipCompURL != null) {
                    let comp = UIPackage.createObjectFromURL(GUISettings.closeTipCompURL);
                    this.__mask.node.addChild(comp.node);
                    //水平居中 底对齐
                    comp.setPosition((comp.width - comp.width) * 0.5, comp.height - 50);
                    comp.addRelation(comp, RelationType.Center_Center);
                    comp.addRelation(comp, RelationType.Bottom_Bottom);
                }
            }
            this.viewComponent.addChild(this.ui!);
        } else {
            this.ui = this.viewComponent = uiCom;
        }
        this.ui.name = this.info.uiName;
        if (this.__createdCallBack) {
            this.__createdCallBack();
            this.__createdCallBack = null;
        }
    }

    protected _maskClickHandler(): void {
        GUIManager.close(this.info.key);
    }

    init(): void {

    }

    show(data?: any): void {
        super.show(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.show(data);
            }
        }
    }

    showedUpdate(data?: any): void {
        super.showedUpdate(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.showedUpdate(data);
            }
        }
    }

    hide(): void {
        super.hide();
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.hide();
            }
        }
    }

    /**
     * 关闭
     * @param checkLayer 是否检查全屏层记录
     */
    close(checkLayer: boolean = true): void {
        GUIManager.close(this.info.key, checkLayer);
    }

    tick(dt: number): void {
        for (let index = 0; index < this.$subMediators.length; index++) {
            const element = this.$subMediators[index];
            element.tick(dt);
        }
    }

    destroy(): void {
        if (this.__mask) {
            this.__mask.offClick(this._maskClickHandler, this);
            this.__mask.dispose();
            this.__mask = null;
        }
        (<GComponent>this.viewComponent).dispose();
        this.info = null;
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.destroy();
            }
        }
    }
}
