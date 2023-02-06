import { Resource, key2URL, url2Key, ResManager, BindingUtils, Timer, Res, LoadingView, GUIManager, Event, LayerManager, TickerManager, GUIState, RelationManager } from 'drongo-cc';
import { UIPackage, GComponent, GRoot, AsyncOperation, GGraph, RelationType } from 'drongo-fgui';
import { assetManager, Color, Node } from 'cc';

class FGUIResource extends Resource {
    constructor() {
        super();
    }
    /**
     * 销毁
     */
    destroy() {
        let url = key2URL(this.key);
        if (typeof url != "string") {
            UIPackage.removePackage(url.url);
            let bundle = assetManager.getBundle(url.bundle);
            let asset = bundle.get(url.url);
            assetManager.releaseAsset(asset);
            console.log("销毁:FGUIPacage=>" + url.bundle + " " + url.url);
        }
        else {
            throw new Error("未处理的Fguipackage销毁！");
        }
        super.destroy();
    }
}

/**
 * FGUI资源加载器
 * @param url
 * @param bundle
 * @param refKey
 * @param progress
 * @param cb
 */
function fguiResLoader(url, bundle, refKey, progress, cb) {
    if (typeof url == "string") {
        if (cb) {
            cb(new Error(url + "类型不正确！"), null);
        }
    }
    else {
        UIPackage.loadPackage(bundle, url.url, (finish, total, item) => {
            if (progress) {
                progress(finish / total);
            }
        }, (err, pkg) => {
            if (err) {
                if (cb) {
                    cb(err, null);
                }
                return;
            }
            const urlKey = url2Key(url);
            if (!ResManager.hasRes(urlKey)) {
                let res = new FGUIResource();
                res.key = urlKey;
                res.content = pkg;
                ResManager.addRes(res);
            }
            let ref = ResManager.addResRef(urlKey, refKey);
            if (cb) {
                cb(null, ref);
            }
        });
    }
}

class Layer extends GComponent {
    constructor(name, isFullScrene = false) {
        super();
        this.node.name = name;
        this.isFullScrene = isFullScrene;
        this.openRecord = [];
        this.makeFullScreen();
    }
    getCount() {
        return this.numChildren;
    }
}

/**
 * cocos fgui 层管理器
 */
class LayerManagerImpl {
    constructor() {
        this.__layerMap = new Map();
    }
    /**
     * 添加层
     * @param key
     * @param layer
     */
    addLayer(key, layer) {
        if (layer instanceof Layer) {
            GRoot.inst.addChild(layer);
            this.__layerMap.set(key, layer);
        }
        else {
            throw new Error("层必须是Layer");
        }
    }
    /**
     * 删除层
     * @param key
     */
    removeLayer(key) {
        let layer = this.__layerMap.get(key);
        if (layer) {
            GRoot.inst.removeChild(layer);
            this.__layerMap.delete(key);
        }
        else {
            throw new Error("找不到要删除的层：" + key);
        }
    }
    getLayer(layerKey) {
        return this.__layerMap.get(layerKey);
    }
    /**
     * 获得所有层
     */
    getAllLayer() {
        let _values = [];
        this.__layerMap.forEach(function (v, key) {
            _values.push(v);
        });
        return _values;
    }
}

/**
 * gui界面通用配置
 */
class GUISettings {
}
/**UI遮罩颜色值 */
GUISettings.mask_color = new Color(0, 0, 0, 255 * 0.5);

/**
 * 基础UIMediator类
 */
class BaseMediator {
    constructor() {
        /**UI组件 */
        this.ui = null;
        /**初始化完毕*/
        this.inited = false;
        /**需要注册和删除的事件*/
        this.__bindEvents = [];
        this.__bindingUtils = new BindingUtils();
    }
    init() {
    }
    tick(dt) {
    }
    show(data) {
        this.data = data;
        this._addBindedEvents();
        this.__bindingUtils.bindByRecords();
    }
    showedUpdate(data) {
        this.data = data;
    }
    hide() {
        this._removeBindedEvents();
        this.__bindingUtils.unbindByRecords();
    }
    destroy() {
        this.__bindEvents.length = 0;
        this.__bindEvents = null;
        this.__bindingUtils.destroy();
        this.__bindingUtils = null;
    }
    /**
     * 根据名称或路径获取组件
     * @param path
     * @returns
     */
    getUIComponent(path) {
        let paths = path.split("/");
        let ui = this.ui;
        let index = 0;
        let uiName;
        while (ui && index < paths.length) {
            uiName = paths[index];
            //兼容m_写法
            if (uiName.startsWith("m_")) {
                uiName = uiName.replace("m_", "");
            }
            ui = ui.getChild(uiName);
            index++;
        }
        return ui;
    }
    /**
     * 属性和属性的绑定
     */
    bindAA(source, property, target, tProperty) {
        this.__bindingUtils.bindAA(source, property, target, tProperty);
    }
    /**
     * 取消属性和属性的绑定
     * @param source
     * @param property
     * @param target
     * @param tProperty
     */
    unbindAA(source, property, target, tProperty) {
        this.__bindingUtils.unbindAA(source, property, target, tProperty);
    }
    /**
     * 属性和函数的绑定
     * @param source
     * @param property
     * @param callBack
     * @param caller
     */
    bindAM(source, property, callBack, caller) {
        this.__bindingUtils.bindAM(source, property, callBack, caller);
    }
    /**
     * 取消属性和函数的绑定
     * @param source
     * @param propertys
     * @param callBack
     * @param caller
     */
    unbidAM(source, propertys, callBack, caller) {
        this.__bindingUtils.unbidAM(source, propertys, callBack, caller);
    }
    /**
     * 函数和函数的绑定
     * @param source
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    bindMM(source, functionName, preHandle, laterHandler) {
        this.__bindingUtils.bindMM(source, functionName, preHandle, laterHandler);
    }
    /**
     * 取消方法和方法的绑定关系
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    unbindMM(source, functionName, preHandle, laterHandler) {
        this.__bindingUtils.unbindMM(source, functionName, preHandle, laterHandler);
    }
    /**
     * 绑定事件
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    bindEvent(target, type, handler, caller) {
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const element = this.__bindEvents[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                throw new Error("重复绑定UI事件：" + target + type + handler + caller);
            }
        }
        if (!this.inited) {
            this.__bindEvents.push({ target: target, eventType: type, handler: handler, caller: caller });
        }
        else {
            target.on(type, handler, caller);
        }
    }
    /**
     * 取消事件绑定
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    unbindEvent(target, type, handler, caller) {
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const element = this.__bindEvents[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                this.__bindEvents.splice(index, 1);
                if (this.inited) {
                    target.off(type, handler, caller);
                }
            }
        }
    }
    /**
     * 按照绑定记录添加事件
     */
    _addBindedEvents() {
        if (this.__bindEvents.length == 0) {
            return;
        }
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const eventInfo = this.__bindEvents[index];
            eventInfo.target.on(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
        }
    }
    /**
     * 删除已绑定事件
     */
    _removeBindedEvents() {
        if (this.__bindEvents.length == 0) {
            return;
        }
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const eventInfo = this.__bindEvents[index];
            eventInfo.target.off(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
        }
    }
}

var LoadState;
(function (LoadState) {
    LoadState[LoadState["Null"] = 0] = "Null";
    LoadState[LoadState["Loading"] = 1] = "Loading";
    LoadState[LoadState["Loaded"] = 2] = "Loaded";
})(LoadState || (LoadState = {}));
/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
class GUIProxy {
    constructor(info) {
        /**关闭时间*/
        this.closeTime = 0;
        /**UI层次*/
        this.zIndex = 0;
        /**资源引用*/
        this.__resRef = null;
        /**是否在显示中*/
        this.__showing = false;
        /**加载状态 */
        this.__loadState = LoadState.Null;
        this.info = info;
        if (!this.info) {
            throw new Error("UI信息不能为空！");
        }
        this.__uiURL = { url: "ui/" + this.info.packageName, type: "fgui", bundle: this.info.bundleName };
    }
    //加载UI资源
    __loadAssets() {
        this.__startTime = Timer.currentTime;
        this.__loadState = LoadState.Loading;
        Res.getResRef(this.__uiURL, this.info.uiName, this.__loadAssetProgress.bind(this)).then(this.__loadAssetComplete.bind(this), this.__loadAssetError.bind(this));
    }
    __loadAssetProgress(progress) {
        LoadingView.changeData({ label: this.info.uiName + " asset loading...", progress: progress });
    }
    __loadAssetError(err) {
        if (err) {
            LoadingView.changeData({ label: err.message });
        }
    }
    __loadAssetComplete(result) {
        let resKey = url2Key(this.__uiURL);
        if (resKey != result.key) {
            result.dispose();
            return;
        }
        //资源是否存在
        this.__resRef = result;
        if (!this.__resRef) {
            throw new Error("加载UI资源失败:" + this.info.packageName + " ");
        }
        let viewCreatorCom = GUIProxy.createNode.addComponent(this.info.uiName + "Mediator");
        let viewCreator = viewCreatorCom;
        if (!viewCreator) {
            throw new Error(this.info.uiName + "_ViewCreator类不存在或未实现IViewCreator!");
        }
        this.mediator = viewCreator.createMediator();
        //销毁
        GUIProxy.createNode.removeComponent(viewCreatorCom);
        viewCreatorCom.destroy();
        this.__loadState = LoadState.Loaded;
        this.mediator.createUI(this.info, this.__createUICallBack.bind(this));
    }
    /**
     * UI创建完成回调
     */
    __createUICallBack() {
        this.mediator.init();
        this.mediator.inited = true;
        if (this.__showing) {
            this.__show();
        }
    }
    __addToLayer() {
        this.layer.addChildAt(this.mediator.viewComponent, this.zIndex);
        this.mediator.viewComponent.visible = true;
    }
    tick(dt) {
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
    show(data) {
        this.__showing = true;
        this.zIndex = this.getLayerChildCount();
        this.data = data;
        this.__show();
    }
    showedUpdate(data) {
        if (this.mediator && this.__showing) {
            this.mediator.showedUpdate(data);
        }
    }
    __show() {
        if (this.__loadState == LoadState.Null) {
            this.__loadAssets();
        }
        else if (this.__loadState == LoadState.Loading) ;
        else {
            this.__addToLayer();
            LoadingView.hide();
            this.mediator.show(this.data);
            this.data = null;
            //如果界面已经被关闭(这是有可能的！);
            if (!GUIManager.isOpen(this.info.key)) {
                return;
            }
            if (this.mediator.playShowAnimation) {
                this.mediator.playShowAnimation(this.__showAnimationPlayed);
            }
            else {
                Event.emit(Event.SHOW, this.info.key);
            }
        }
    }
    __showAnimationPlayed() {
        Event.emit(Event.SHOW, this.info.key);
    }
    hide() {
        if (this.__loadState == LoadState.Loading) {
            this.__loadState = LoadState.Null;
        }
        else if (this.__loadState == LoadState.Loaded) {
            //如果在显示中
            if (this.__showing) {
                if (this.mediator.playHideAnimation) {
                    this.mediator.playHideAnimation(this.__hideAnimationPlayed);
                }
                else {
                    this.__hide();
                }
            }
        }
    }
    __hideAnimationPlayed() {
        if (this.__showing) {
            this.__hide();
        }
    }
    __hide() {
        this.mediator.viewComponent.visible = false;
        this.mediator.hide();
        this.__showing = false;
        Event.emit(Event.HIDE, this.info.key);
    }
    destroy() {
        var _a;
        console.log("UI销毁=>" + ((_a = this.info) === null || _a === void 0 ? void 0 : _a.key));
        this.mediator.destroy();
        this.mediator = undefined;
        this.info = undefined;
        this.data = null;
        if (this.__resRef) {
            this.__resRef.dispose();
            this.__resRef = null;
        }
    }
    getLayerChildCount() {
        return this.layer.getCount();
    }
    get layer() {
        let l = LayerManager.getLayer(this.info.layer);
        if (l === undefined) {
            throw new Error("layer：" + this.info.layer + "不存在！");
        }
        return l;
    }
    /**
     * 获取组件
     * @param path
     */
    getComponent(path) {
        if (!this.mediator) {
            return null;
        }
        return this.mediator.getUIComponent(path);
    }
}
/**用于Creator创建器的统一帮助节点 */
GUIProxy.createNode = new Node("createHelpNode");

/**
 * GUI管理器
 */
class GUIManagerImpl {
    constructor() {
        /**已注册*/
        this.__registered = new Map();
        /**实例 */
        this.__instances = new Map();
        /**
         * 删除列表
         */
        this.__destryList = [];
        TickerManager.addTicker(this);
        //监听打开和关闭事件
        Event.on(Event.SHOW, this.__showedHandler, this);
        Event.on(Event.HIDE, this.__closedHandler, this);
    }
    /**获取某个组件 */
    getUIComponent(key, path) {
        if (!this.__instances.has(key)) {
            throw new Error("GUI：" + key + "实例，不存在！");
        }
        let guiProxy = this.__instances.get(key);
        return guiProxy.getComponent(path);
    }
    /**
     * 获取界面的mediator
     * @param key
     */
    getMediatorByKey(key) {
        if (!this.__instances.has(key)) {
            return null;
        }
        return this.__instances.get(key).mediator;
    }
    __showedHandler(type, target, data) {
        let guiKey = data;
        this.setGUIState(guiKey, GUIState.Showed);
    }
    __closedHandler(type, target, data) {
        let guiKey = data;
        this.setGUIState(guiKey, GUIState.Closed);
    }
    register(info) {
        if (this.__registered.has(info.key)) {
            throw new Error("重复注册！");
        }
        this.__registered.set(info.key, info);
    }
    unregister(key) {
        if (!this.__registered.has(key)) {
            throw new Error("未找到要注销的界面信息！");
        }
        this.__registered.delete(key);
    }
    tick(dt) {
        this.__destryList.length = 0;
        let currentTime = Timer.currentTime;
        // value和key就是map的key，value，map是字典本身
        this.__instances.forEach((value, key, map) => {
            if (value.info.state == GUIState.Showed) {
                value.tick(dt);
            }
            else if (value.info.state == GUIState.Closed) {
                if (!value.info.permanence) {
                    if (currentTime - value.closeTime > GUIManager.GUI_GC_INTERVAL) {
                        this.__destryList.push(key);
                    }
                }
            }
        });
        if (this.__destryList.length > 0) {
            let gui;
            for (let index = 0; index < this.__destryList.length; index++) {
                const key = this.__destryList[index];
                gui = this.__instances.get(key);
                gui.info.state = GUIState.Null; //标记为null;
                this.__instances.delete(key);
                gui.destroy();
            }
        }
    }
    open(key, data) {
        this.__open(key, data);
        this.__checkRelation(key, true);
    }
    __open(key, data) {
        let state = this.getGUIState(key);
        let guiProxy;
        //没打开过！
        if (state == GUIState.Null) {
            let info = this.__registered.get(key);
            guiProxy = new GUIProxy(info);
            guiProxy.info.state = GUIState.Showing;
            this.__instances.set(info.key, guiProxy);
            this.checkFullLayer(guiProxy);
            guiProxy.show(data);
            return;
        }
        //打开中
        if (state == GUIState.Showing) {
            guiProxy = this.__instances.get(key);
            this.checkFullLayer(guiProxy);
            //只是更新数据
            guiProxy.show(data);
            return;
        }
        //已经打开
        if (state == GUIState.Showed) {
            guiProxy = this.__instances.get(key);
            this.checkFullLayer(guiProxy);
            guiProxy.showedUpdate(data);
            //界面已打开，则隐藏进度条
            LoadingView.hide();
            return;
        }
        //关闭/关闭中
        if (state == GUIState.Closeing || state == GUIState.Closed) {
            guiProxy = this.__instances.get(key);
            guiProxy.info.state = GUIState.Showing;
            this.checkFullLayer(guiProxy);
            guiProxy.show(data);
            return;
        }
    }
    //全屏层同时只能打开一个界面
    checkFullLayer(guiProxy) {
        let layer = LayerManager.getLayer(guiProxy.info.layer);
        if (layer.isFullScrene) {
            for (let index = 0; index < layer.openRecord.length; index++) {
                const guiKey = layer.openRecord[index];
                //新打开的界面也可能在记录里
                if (guiKey != guiProxy.info.key) {
                    this.__close(guiKey);
                }
            }
            layer.openRecord.push(guiProxy.info.key);
        }
    }
    close(key, checkLayer = true) {
        this.__close(key, checkLayer);
        this.__checkRelation(key, false);
    }
    closeAll() {
        this.__instances.forEach((value, key, map) => {
            this.close(key, false);
        });
    }
    __close(key, checkLayer = false) {
        let state = this.getGUIState(key);
        let guiProxy;
        //关闭中/已关闭
        if (state == GUIState.Null || state == GUIState.Closed || state == GUIState.Closeing) {
            return;
        }
        guiProxy = this.__instances.get(key);
        guiProxy.closeTime = Timer.currentTime;
        guiProxy.info.state = GUIState.Closeing;
        guiProxy.hide();
        if (!checkLayer) {
            return;
        }
        //通过记录找到要打开的界面
        let layer = LayerManager.getLayer(guiProxy.info.layer);
        if (layer.isFullScrene && layer.openRecord.length > 1) {
            layer.openRecord.pop();
            let guikey = layer.openRecord.pop();
            // console.log("关闭："+key+"时，回到："+guikey);
            this.__open(guikey);
        }
    }
    /**
     * 检测UI关联关系
     * @param key
     */
    __checkRelation(key, isOpen) {
        //关联UI
        let relation = RelationManager.getRelation(key);
        let relationList;
        if (relation) {
            //打开
            if (isOpen) {
                relationList = relation.show;
            }
            else { //关闭
                relationList = relation.hide;
            }
            let guiKey;
            for (let index = 0; index < relationList.show.length; index++) {
                guiKey = relationList.show[index];
                this.__open(guiKey);
            }
            for (let index = 0; index < relationList.hide.length; index++) {
                guiKey = relationList.hide[index];
                this.__close(guiKey);
            }
        }
    }
    /**
     * 获得前一个打开的全屏界面
     */
    getPrevLayer() {
        let layers = LayerManager.getAllLayer();
        for (let i = 0, len = layers.length; i < len; i += 1) {
            if (layers[i].isFullScrene) {
                if (layers[i].openRecord.length > 1) {
                    return layers[i].openRecord[layers[i].openRecord.length - 2];
                }
                break;
            }
        }
        return -1;
    }
    /**
     * 获取界面状态
     * @param key
     */
    getGUIState(key) {
        if (!this.__registered.has(key)) {
            throw new Error("GUI:" + key + "未注册！");
        }
        //不存在
        if (!this.__instances.has(key)) {
            return GUIState.Null;
        }
        let proxy = this.__instances.get(key);
        return proxy.info.state;
    }
    setGUIState(key, state) {
        if (!this.__registered.has(key)) {
            throw new Error("GUI:" + key + "未注册！");
        }
        let info = this.__registered.get(key);
        info.state = state;
    }
    /**
     * 是否已打开或打开中
     * @param key
     * @returns
     */
    isOpen(key) {
        let state = this.getGUIState(key);
        if (state == GUIState.Showing || state == GUIState.Showed) {
            return true;
        }
        return false;
    }
}

/**
 * UI中介者
 */
class GUIMediator extends BaseMediator {
    constructor() {
        super();
        /**根节点 */
        this.viewComponent = null;
        this.info = null;
        /**遮罩 */
        this.__mask = null;
        /**
         * 子UI
         */
        this.$subMediators = [];
    }
    /**
     * 创建UI
     * @param info
     * @param created
     */
    createUI(info, created) {
        this.info = info;
        if (this.info == null) {
            throw new Error("GUI 信息不能为空");
        }
        this.__createdCallBack = created;
        this.__createUI(true);
    }
    __createUI(async) {
        let packageName = this.info.packageName;
        if (async) {
            this.__asyncCreator = new AsyncOperation();
            this.__asyncCreator.callback = this.__uiCreated.bind(this);
            this.__asyncCreator.createObject(packageName, this.info.comName);
        }
        else {
            try {
                let ui = UIPackage.createObject(packageName, this.info.comName);
                this.__uiCreated(ui);
            }
            catch (err) {
                throw new Error("创建界面失败：" + this.info.packageName + " " + this.info.comName);
            }
        }
    }
    __uiCreated(ui) {
        let uiCom = ui.asCom;
        uiCom.makeFullScreen();
        //如果需要遮罩
        if (this.info.modal) {
            this.ui = uiCom;
            this.viewComponent = new GComponent();
            this.viewComponent.makeFullScreen();
            this.__mask = new GGraph();
            this.__mask.makeFullScreen();
            this.__mask.drawRect(0, Color.BLACK, GUISettings.mask_color);
            this.viewComponent.addChild(this.__mask);
            if (this.info.modalClose) {
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
            this.viewComponent.addChild(this.ui);
        }
        else {
            this.ui = this.viewComponent = uiCom;
        }
        this.ui.name = this.info.uiName;
        if (this.__createdCallBack) {
            this.__createdCallBack();
            this.__createdCallBack = null;
        }
    }
    _maskClickHandler() {
        GUIManager.close(this.info.key);
    }
    init() {
    }
    show(data) {
        super.show(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.show(data);
            }
        }
    }
    showedUpdate(data) {
        super.showedUpdate(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.showedUpdate(data);
            }
        }
    }
    hide() {
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
    close(checkLayer = true) {
        GUIManager.close(this.info.key, checkLayer);
    }
    tick(dt) {
        for (let index = 0; index < this.$subMediators.length; index++) {
            const element = this.$subMediators[index];
            element.tick(dt);
        }
    }
    destroy() {
        if (this.__mask) {
            this.__mask.offClick(this._maskClickHandler, this);
            this.__mask.dispose();
            this.__mask = null;
        }
        this.viewComponent.dispose();
        this.info = null;
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.destroy();
            }
        }
    }
}

/**
 * 子UI 逻辑划分
 */
class SubGUIMediator extends BaseMediator {
    constructor(ui, owner) {
        super();
        this.ui = ui;
        this.owner = owner;
        this.init();
        this.inited = true;
    }
    destroy() {
        super.destroy();
        this.owner = null;
        this.ui = null;
    }
}

export { BaseMediator, FGUIResource, GUIManagerImpl, GUIMediator, GUIProxy, GUISettings, Layer, LayerManagerImpl, SubGUIMediator, fguiResLoader };
