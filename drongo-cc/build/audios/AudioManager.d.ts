import { ResURL } from "../res/ResURL";
import { IAudioChannel } from "./IAudioChannel";
/**
 * 音频管理器
 */
export declare class AudioManager {
    /**
     * 全局唯一注入KEY
     */
    static KEY: string;
    /**
     * 最大音频轨道数量
     */
    static MAX_SOUND_CHANNEL_COUNT: number;
    /**
     * 总音量
     */
    static get volume(): number;
    static set volume(value: number);
    /**
     * 音乐音量
     */
    static get musicVolume(): number;
    static set musicVolume(value: number);
    /**
     * 声音音量
     */
    static get soundVolume(): number;
    static set soundVolume(value: number);
    /**
     * 静音总开关
     */
    static get mute(): boolean;
    static set mute(value: boolean);
    /**
     * 音乐静音开关
     */
    static get muteMusic(): boolean;
    static set muteMusic(value: boolean);
    /**
     * 声音静音开关
     */
    static get muteSound(): boolean;
    static set muteSound(value: boolean);
    /**
     * 播放音乐
     * @param value
     */
    static playMusic(url: ResURL, volume?: number, speed?: number, loop?: boolean): void;
    /**
     * 停止音乐
     */
    static stopMusic(): void;
    /**
     * 暂停
     */
    static pauseMusic(): void;
    /**
     * 继续播放
     */
    static resumeMusic(): void;
    /**
     * 播放声音
     * @param value
     */
    static playSound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    static getPlaying(url: ResURL): IAudioChannel;
    private static __impl;
    private static get impl();
}
