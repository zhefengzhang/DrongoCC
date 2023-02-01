import { assetManager } from 'cc';

/**
 * 音频管理器
 */
class AudioManager {
    /**
     * 总音量
     */
    static get volume() {
        return this.impl.volume;
    }
    static set volume(value) {
        this.impl.volume = value;
    }
    /**
     * 音乐音量
     */
    static get musicVolume() {
        return this.impl.musicVolume;
    }
    static set musicVolume(value) {
        this.impl.musicVolume = value;
    }
    /**
     * 声音音量
     */
    static get soundVolume() {
        return this.impl.soundVolume;
    }
    static set soundVolume(value) {
        this.impl.soundVolume = value;
    }
    /**
     * 静音总开关
     */
    static get mute() {
        return this.impl.mute;
    }
    static set mute(value) {
        this.impl.mute = value;
    }
    /**
     * 音乐静音开关
     */
    static get muteMusic() {
        return this.impl.muteMusic;
    }
    static set muteMusic(value) {
        this.impl.muteMusic = value;
    }
    /**
     * 声音静音开关
     */
    static get muteSound() {
        return this.impl.muteSound;
    }
    static set muteSound(value) {
        this.impl.muteSound = value;
    }
    /**
     * 播放音乐
     * @param value
     */
    static playMusic(url, volume = 1, speed = 1, loop = false) {
        this.impl.playMusic(url, volume, speed, loop);
    }
    /**
     * 停止音乐
     */
    static stopMusic() {
        this.impl.stopMusic();
    }
    /**
     * 暂停
     */
    static pauseMusic() {
        this.impl.pauseMusic();
    }
    /**
     * 继续播放
     */
    static resumeMusic() {
        this.impl.resumeMusic();
    }
    /**
     * 播放声音
     * @param value
     */
    static playSound(url, playedCallBack, volume, speed, loop) {
        this.impl.playSound(url, playedCallBack, volume, speed, loop);
    }
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    static getPlaying(url) {
        return this.impl.getPlaying(url);
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "未注入！");
        }
        return this.__impl;
    }
}
/**
 * 全局唯一注入KEY
 */
AudioManager.KEY = "AudioManager";
/**
 * 最大音频轨道数量
 */
AudioManager.MAX_SOUND_CHANNEL_COUNT = 30;

/**
 * 注入器
 */
class Injector {
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static inject(customKey, clazz) {
        if (clazz instanceof Function) {
            this.__injectedMap.set(customKey, clazz);
        }
        else {
            this.__instanceMap.set(customKey, clazz);
        }
    }
    /**
     * 获取已注入的类型实例
     */
    static getInject(customKey) {
        let instance = this.__instanceMap.get(customKey);
        if (instance) {
            return instance;
        }
        let clazz = this.__injectedMap.get(customKey);
        if (clazz === undefined) {
            return null;
        }
        instance = new clazz();
        this.__instanceMap.set(customKey, instance);
        return instance;
    }
}
/**类型字典*/
Injector.__injectedMap = new Map();
/**实例字典*/
Injector.__instanceMap = new Map();

/**
 * 时间工具类
 */
class Timer {
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime() {
        return this.impl.currentTime;
    }
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime() {
        return this.impl.absTime;
    }
    /**
     * 重新校准
     */
    static reset() {
        this.impl.reset();
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}
Timer.KEY = "Timer";

/**
 * 心跳管理器
 */
class TickManager {
    /**
     * 添加
     * @param value
     */
    static addTicker(value) {
        this.impl.addTicker(value);
    }
    /**
     * 删除
     * @param value
     */
    static removeTicker(value) {
        this.impl.removeTicker(value);
    }
    /**
     * 下一帧回调
     * @param value
     */
    static callNextFrame(value, caller) {
        this.impl.callNextFrame(value, caller);
    }
    static clearNextFrame(value, caller) {
        this.impl.clearNextFrame(value, caller);
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + " 未注入!");
        }
        return this.__impl;
    }
}
TickManager.KEY = "TickManager";

/**
 * 事件分发器(只有一对多的情况下去使用)
 */
class EventDispatcher {
    constructor() {
        /**
        * 对象已经注册的处理器
        */
        this.callerMap = new Map();
        /**
         * 事件派发器上所监听的处理器
         */
        this.keyMap = new Map();
    }
    /**
     * 添加事件
     * @param key
     * @param caller
     * @param func
     * @param priority 优先级（数字越小优先级越高）
     */
    on(key, handler, caller, priority = 0) {
        let infoList;
        let info;
        if (this.keyMap.has(key)) {
            infoList = this.keyMap.get(key);
            for (const iterator of infoList) {
                if (iterator.target == caller && iterator.handler == handler) {
                    console.error("重复添加同一个事件监听：" + key + " " + caller + " " + handler);
                    return;
                }
            }
        }
        else {
            infoList = [];
            this.keyMap.set(key, infoList);
        }
        info = new EventInfo(key, caller, handler);
        infoList.push(info);
        //按照优先级排序
        infoList.sort((a, b) => a.priority - priority);
        //处理器关联处理
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller);
            for (const iterator of infoList) {
                if (iterator.key == key && iterator.handler == handler) {
                    console.error("事件系统 处理器关联错误：" + key + " " + caller + " " + handler);
                }
            }
        }
        else {
            infoList = [];
            this.callerMap.set(caller, infoList);
        }
        infoList.push(info);
    }
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    off(key, handler, caller) {
        if (this.keyMap.has(key) == false) {
            return;
        }
        let infoList = this.keyMap.get(key);
        let info;
        let deleteInfo = null;
        //删除
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                deleteInfo = info;
                infoList.splice(index, 1);
                break;
            }
        }
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller);
            //删除
            for (let index = 0; index < infoList.length; index++) {
                info = infoList[index];
                if (info.key == key && info.handler == handler) {
                    deleteInfo = info;
                    infoList.splice(index, 1);
                    break;
                }
            }
        }
        //销毁处理器
        if (deleteInfo) {
            deleteInfo.destroy();
        }
    }
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    offByCaller(caller) {
        let infoList = this.callerMap.get(caller);
        if (infoList === undefined || infoList.length == 0) {
            return;
        }
        let info;
        //逐个删除
        while (infoList.length) {
            info = infoList[0];
            this.off(info.key, info.handler, info.target);
        }
        //删除空列表
        this.callerMap.delete(caller);
    }
    /**
     * 删除所有事件监听
     */
    offAllEvent() {
        this.keyMap.forEach(infoList => {
            infoList.forEach(info => {
                info.destroy();
            });
        });
        this.keyMap.clear();
        this.callerMap.clear();
    }
    /**
     * 派发事件
     * @param key
     * @param data
     */
    emit(key, data) {
        if (this.keyMap.has(key) == false) {
            return;
        }
        let infoList = this.keyMap.get(key);
        let info;
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            info.handler.apply(info.target, [key, this, data]);
        }
    }
    /**
     * 是否有事件监听
     * @param key
     */
    hasEvent(key) {
        return this.keyMap.has(key);
    }
    /**
     * 是否包含指定函数事件监听
     * @param key
     * @param caller
     * @param func
     */
    hasEventHandler(key, handler, caller) {
        if (this.keyMap.has(key) == false) {
            return false;
        }
        let infoList = this.keyMap.get(key);
        let info;
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                return true;
            }
        }
        return false;
    }
    destroy() {
        this.callerMap.clear();
        this.keyMap.clear();
    }
}
class EventInfo {
    constructor(key, target, handler) {
        this.key = "";
        this.priority = 255;
        this.key = key;
        this.target = target;
        this.handler = handler;
    }
    destroy() {
    }
}

class Event {
    /**
     * 获取事件通道
     * @param key
     * @returns
     */
    static getChannel(key = "main") {
        return this.channels.get(key);
    }
    /**
     * 派发事件
     * @param eventType
     * @param data
     * @param channel   通道
     */
    static emit(eventType, data, channel = "main") {
        if (!this.channels.has(channel)) {
            return;
        }
        let eventChannel = this.channels.get(channel);
        eventChannel.emit(eventType, data);
    }
    /**
     * 添加事件监听
     * @param type
     * @param handler
     * @param caller
     * @param priority  优先级
     * @param channel   事件通道
     */
    static on(type, handler, caller, priority = 0, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            eventChannel = new EventDispatcher();
            this.channels.set(channel, eventChannel);
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.on(type, handler, caller, priority);
    }
    /**
     * 删除事件监听
     * @param type
     * @param handler
     * @param caller
     * @param channel
     * @returns
     */
    static off(type, handler, caller, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.off(type, handler, caller);
    }
    /**
     * 删除指定对象上的所有事件监听
     * @param caller
     * @param channel
     * @returns
     */
    static offByCaller(caller, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.offByCaller(caller);
    }
    /**
     * 删除指定通道上的所有事件监听
     * @param channel
     * @returns
     */
    static offAll(channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.offAllEvent();
    }
}
Event.START = "start";
Event.PROGRESS = "progress";
Event.COMPLETE = "complete";
Event.ERROR = "Error";
Event.ADD = "add";
Event.REMOVE = "remove";
Event.UPDATE = "update";
Event.CLEAR = "clear";
Event.State_Changed = "stateChanged";
/**事件通道 */
Event.channels = new Map();

/**
 * 列表
 */
class List extends EventDispatcher {
    constructor(only = true) {
        super();
        /**
         * 是否保证元素的唯一性
         */
        this.__only = false;
        /**
         * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
         */
        this.count = 0;
        this.__only = only;
        this.__element = [];
    }
    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     */
    push(value) {
        if (this.__only) {
            let index = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.push(value);
        this.count = this.__element.length;
        if (this.hasEvent(Event.ADD)) {
            this.emit(Event.ADD, value);
        }
        return true;
    }
    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     * @returns
     */
    unshift(value) {
        if (this.__only) {
            let index = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.unshift(value);
        this.count = this.__element.length;
        if (this.hasEvent(Event.ADD)) {
            this.emit(Event.ADD, value);
        }
        return true;
    }
    /**
     * 获取并删除最后一个元素
     * @returns
     */
    pop() {
        if (this.__element.length > 0) {
            const result = this.__element.pop();
            this.count = this.__element.length;
            if (this.hasEvent(Event.REMOVE)) {
                this.emit(Event.REMOVE, result);
            }
            return result;
        }
        return null;
    }
    /**
     * 获取并删除第一个元素
     * @returns
     */
    shift() {
        if (this.__element.length > 0) {
            const result = this.__element.shift();
            this.count = this.__element.length;
            if (this.hasEvent(Event.REMOVE)) {
                this.emit(Event.REMOVE, result);
            }
            return result;
        }
        return null;
    }
    /**
     * 删除指定索引的元素
     * @param index
     */
    removeAt(index) {
        if (index >= this.__element.length) {
            throw new Error("删除索引超出范围！");
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.hasEvent(Event.REMOVE)) {
            this.emit(Event.REMOVE, result);
        }
        return result;
    }
    /**
     * 删除元素
     * @param value
     */
    remove(value) {
        let index = this.__element.indexOf(value);
        if (index < 0) {
            throw new Error("要删除的内容不在列表中！" + value);
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.hasEvent(Event.REMOVE)) {
            this.emit(Event.REMOVE, result);
        }
    }
    /**
     * 移除所有元素
     */
    clear() {
        this.count = 0;
        this.__element.length = 0;
        if (this.hasEvent(Event.CLEAR)) {
            this.emit(Event.CLEAR);
        }
    }
    /**
     * 判断是否包含
     * @param value
     * @returns
     */
    has(value) {
        return this.find(value) >= 0;
    }
    /**
     * 查找元素下标
     * @param value
     * @returns
     */
    find(value) {
        return this.__element.indexOf(value);
    }
    /**
     * 查找元素下标
     * @param predicate
     * @returns
     */
    findIndex(predicate) {
        let index = this.__element.findIndex(predicate);
        return index;
    }
    /**
     * 获取指定元素
     * @param index
     * @returns
     */
    get(index) {
        if (index >= this.__element.length) {
            throw new Error("超出索引范围:" + index + "/" + this.__element.length);
        }
        return this.__element[index];
    }
    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements() {
        return this.__element;
    }
}

/**
 * 字典
 */
class Dictionary extends EventDispatcher {
    constructor() {
        super();
        this.__map = new Map();
        this.__list = [];
    }
    set(key, value) {
        let old;
        //删除老的
        if (this.__map.has(key)) {
            old = this.__map.get(key);
            const index = this.__list.indexOf(old);
            if (index < 0) {
                throw new Error("Dictionary内部逻辑错误！");
            }
            this.__map.delete(key);
            this.__list.splice(index, 1);
            this.emit(Event.REMOVE, old);
        }
        this.__map.set(key, value);
        this.__list.push(value);
        this.emit(Event.ADD, value);
    }
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    has(key) {
        return this.__map.has(key);
    }
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    get(key) {
        return this.__map.get(key);
    }
    /**
     * 通过索引获取元素
     * @param index
     * @returns
     */
    getValue(index) {
        if (index >= this.__list.length) {
            throw new Error(index + "索引超出0-" + this.__list.length + "范围");
        }
        return this.__list[index];
    }
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    delete(key) {
        if (!this.__map.has(key)) {
            return undefined;
        }
        const result = this.__map.get(key);
        const index = this.__list.indexOf(result);
        if (index < 0) {
            throw new Error("Dictionary内部逻辑错误！");
        }
        this.__list.splice(index, 1);
        this.__map.delete(key);
        //派发删除事件
        if (this.hasEvent(Event.REMOVE)) {
            this.emit(Event.REMOVE, result);
        }
        return result;
    }
    /**
     * 清除所有元素
     */
    clear() {
        this.__map.clear();
        this.__list.length = 0;
    }
    /**
    * 元素列表
    */
    get elements() {
        return this.__list;
    }
    get size() {
        return this.__map.size;
    }
    destroy() {
        super.destroy();
        this.__map.clear();
        this.__map = null;
        this.__list = null;
    }
}

class ResManager {
    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value) {
        this.impl.addRes(value);
    }
    /**
     * 是否包含该资源
     * @param key
     */
    static hasRes(key) {
        return this.impl.hasRes(key);
    }
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static addResRef(key, refKey) {
        return this.impl.addResRef(key, refKey);
    }
    /**
     * 删除一个资源引用
     * @param value
     */
    static removeResRef(value) {
        return this.impl.removeResRef(value);
    }
    /**
     * 资源清理
     */
    static gc(ignoreTime) {
        return this.impl.gc(ignoreTime);
    }
    /**
     * 资源列表
     * @returns
     */
    static resList() {
        return this.impl.resList;
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error("未注入：" + this.KEY);
        }
        return this.__impl;
    }
}
ResManager.KEY = "ResManager";
/**
 * 资源保留长时间GC
 */
ResManager.GC_TIME = 15;
/**
 * 自动清理
 */
ResManager.AUTO_GC = true;

/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
function resURL2Key(url) {
    return ResURLUtils.resURL2Key(url);
}
class ResURLUtils {
    static getAssetType(key) {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key);
    }
    /**
     * 唯一key转URL
     * @param key
     * @returns
     */
    static key2ResURL(key) {
        if (key.indexOf("|")) {
            let arr = key.split("|");
            return { url: arr[0], bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }
    /**
     * 资源地址转唯一KEY
     * @param url
     * @returns
     */
    static resURL2Key(url) {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        return url.url + "|" + url.bundle + "|" + this.getClassName(url.type);
    }
    static getClassName(clazz) {
        let className;
        if (typeof clazz != "string") {
            className = clazz.toString();
        }
        else {
            className = clazz;
        }
        className = className.replace("function ", "");
        let index = className.indexOf("()");
        if (index < 0) {
            throw new Error("获取类型名称错误：" + className);
        }
        className = className.substring(0, index);
        if (!this.__assetTypes.has(className)) {
            this.__assetTypes.set(className, clazz);
        }
        return className;
    }
}
ResURLUtils.__assetTypes = new Map();

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Res {
    static setResLoader(key, loader) {
        this.__loaders.set(key, loader);
    }
    static getResLoader(key) {
        if (!this.__loaders.has(key)) {
            throw new Error("未注册的加载器：" + key);
        }
        return this.__loaders.get(key);
    }
    /**
     * 获取资源引用
     * @param urls
     * @param refKey    谁持有该引用
     * @param progress  进度汇报函数
     * @returns
     */
    static getResRef(urls, refKey, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.resourcePool) {
                throw new Error("资源对象池未设置！");
            }
            if (Array.isArray(urls)) {
                let list = [];
                let loaded = 0;
                for (let index = 0; index < urls.length; index++) {
                    const url = urls[index];
                    const result = yield this.loadAsset(url, refKey, (childProgress) => {
                        if (progress) {
                            progress((loaded + childProgress) / urls.length);
                        }
                    });
                    list.push(result);
                }
                return yield Promise.all(list);
            }
            else {
                //已加载完成
                let urlKey = resURL2Key(urls);
                if (ResManager.hasRes(urlKey)) {
                    return Promise.resolve(ResManager.addResRef(urlKey, refKey));
                }
                return yield this.loadAsset(urls, refKey, (childProgress) => {
                    if (progress) {
                        progress(childProgress);
                    }
                });
            }
        });
    }
    static loadAsset(url, refKey, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            //已加载完成
            const urlKey = resURL2Key(url);
            if (ResManager.hasRes(urlKey)) {
                return Promise.resolve(ResManager.addResRef(urlKey, refKey));
            }
            let promise = new Promise((resolve, reject) => {
                if (typeof url == "string") {
                    throw new Error("未实现！");
                }
                let bundle = assetManager.getBundle(url.bundle);
                let loader;
                if (!bundle) {
                    assetManager.loadBundle(url.bundle, (err, bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (typeof url.type == "function") {
                            loader = this.defaultAssetLoader;
                        }
                        else {
                            loader = this.getResLoader(url.type);
                        }
                        loader(url, bundle, progress, (err, asset) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (ResManager.hasRes(urlKey)) {
                                resolve(ResManager.addResRef(urlKey, refKey));
                            }
                            else {
                                let res = this.resourcePool.allocate();
                                res.key = urlKey;
                                res.content = asset;
                                ResManager.addRes(res);
                                resolve(ResManager.addResRef(urlKey, refKey));
                            }
                        });
                    });
                }
                else {
                    if (typeof url.type == "function") {
                        loader = this.defaultAssetLoader;
                    }
                    else {
                        loader = this.getResLoader(url.type);
                    }
                    loader(url, bundle, progress, (err, asset) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (ResManager.hasRes(urlKey)) {
                            resolve(ResManager.addResRef(urlKey, refKey));
                        }
                        else {
                            let res = this.resourcePool.allocate();
                            res.key = urlKey;
                            res.content = asset;
                            ResManager.addRes(res);
                            resolve(ResManager.addResRef(urlKey, refKey));
                        }
                    });
                }
            });
            return promise;
        });
    }
    /**
     * 默认加载器
     * @param url
     * @param bundle
     * @param progress
     * @param cb
     */
    static defaultAssetLoader(url, bundle, progress, cb) {
        if (typeof url == "string") {
            throw new Error("url不能为字符串" + url);
        }
        if (typeof url.type == "string") {
            throw new Error("url.type不能为字符串" + url);
        }
        bundle.load(url.url, url.type, progress, cb);
    }
}
Res.__loaders = new Map();

class ResRef {
    constructor() {
        /**唯一KEY */
        this.key = "";
        /**是否已释放 */
        this.__isDispose = false;
    }
    /**释放 */
    dispose() {
        if (this.__isDispose) {
            throw new Error("重复释放资源引用");
        }
        this.__isDispose = true;
        // ResourceManager.removeResRef(this);
    }
    get isDispose() {
        return this.__isDispose;
    }
    reset() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
        this.__isDispose = false;
    }
    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    destroy() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
    }
}

/**
 * 任务队列
 */
class TaskQueue extends EventDispatcher {
    constructor() {
        super();
        this.__index = 0;
        this.__taskList = [];
    }
    addTask(value) {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }
    removeTask(value) {
        let index = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("未找到要删除的内容！");
        }
        this.__taskList.splice(index, 1);
    }
    start(data) {
        this.__index = 0;
        this.__tryNext();
    }
    __tryNext() {
        if (this.__index < this.__taskList.length) {
            let task = this.__taskList[this.__index];
            task.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            task.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            task.on(Event.ERROR, this.__subTaskEventHandler, this);
            task.start();
        }
        else {
            //结束
            this.emit(Event.COMPLETE);
        }
    }
    __subTaskEventHandler(key, target, data) {
        if (key == Event.PROGRESS) {
            let dataValue = Number(data) == undefined ? 0 : Number(data);
            let progress = (this.__index + dataValue) / this.__taskList.length;
            this.emit(Event.PROGRESS, progress);
            return;
        }
        target.offAllEvent();
        if (key == Event.ERROR) {
            this.emit(Event.ERROR, data);
            return;
        }
        target.destroy();
        this.__index++;
        this.__tryNext();
    }
    destroy() {
        super.destroy();
        this.__taskList.length = 0;
        this.__index = 0;
    }
}

/**
 * 任务序列（并行）
 */
class TaskSequence extends EventDispatcher {
    constructor() {
        super();
        this.__taskList = new Array();
        this.__index = 0;
    }
    addTask(value) {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }
    removeTask(value) {
        let index = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的内容!");
        }
        this.__taskList.splice(index, 1);
    }
    start(data) {
        for (let index = 0; index < this.__taskList.length; index++) {
            const element = this.__taskList[index];
            element.on(Event.COMPLETE, this.__subTaskEventHandler, this);
            element.on(Event.ERROR, this.__subTaskEventHandler, this);
            element.on(Event.PROGRESS, this.__subTaskEventHandler, this);
            element.start();
        }
    }
    __subTaskEventHandler(type, target, data) {
        if (type == Event.PROGRESS) {
            this.emit(Event.PROGRESS, this.__index / this.__taskList.length);
            return;
        }
        target.offAllEvent();
        if (type == Event.ERROR) {
            this.emit(Event.ERROR, data);
            return;
        }
        this.__index++;
        if (this.__index < this.__taskList.length) {
            return;
        }
        target.destroy();
        //完成
        this.emit(Event.COMPLETE);
    }
    destroy() {
        super.destroy();
        this.__taskList.length = 0;
        this.__index = 0;
    }
}

class Debuger {
    /**
     * 设置过滤
     * @param key
     * @param isOpen
     */
    static debug(key, isOpen) {
        this.__debuger.set(key, isOpen);
    }
    /**
     * 获取已保存的日志
     * @param type
     * @returns
     */
    static getLogs(type) {
        if (type == undefined || type == null) {
            type = "all";
        }
        if (this.__logs.has(type)) {
            return this.__logs.get(type);
        }
        return null;
    }
    static __save(type, logType, msg) {
        let list;
        if (!this.__logs.has(type)) {
            list = [];
            this.__logs.set(type, list);
        }
        else {
            list = this.__logs.get(type);
        }
        let data = "[" + type + "]" + logType + ":" + msg;
        if (list.length >= this.MaxCount) {
            list.unshift(); //删除最顶上的那条
        }
        list.push(data);
        //保存到all
        if (!this.__logs.has("all")) {
            list = [];
            this.__logs.set("all", list);
        }
        else {
            list = this.__logs.get("all");
        }
        if (list.length >= this.MaxCount) {
            list.unshift(); //删除最顶上的那条
        }
        list.push(data);
        return data;
    }
    static log(type, msg) {
        let data = this.__save(type, "Log", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.log(data);
        }
    }
    static err(type, msg) {
        let data = this.__save(type, "Error", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.error(data);
        }
    }
    static warn(type, msg) {
        let data = this.__save(type, "Warn", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.warn(data);
        }
    }
    static info(type, msg) {
        let data = this.__save(type, "Info", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.info(data);
        }
    }
}
/**
 * 最大保存条数
 */
Debuger.MaxCount = Number.MAX_SAFE_INTEGER;
Debuger.__logs = new Dictionary();
Debuger.__debuger = new Map();

export { AudioManager, Debuger, Dictionary, Injector, List, Res, ResRef, TaskQueue, TaskSequence, TickManager, Timer };
