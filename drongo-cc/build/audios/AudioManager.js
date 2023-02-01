import { Injector } from "../drongo-cc";
/**
 * 音频管理器
 */
export class AudioManager {
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
