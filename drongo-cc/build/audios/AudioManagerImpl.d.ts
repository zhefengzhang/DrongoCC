import { ResURL } from "../res/ResURL";
import { IAudioChannel } from "./IAudioChannel";
import { IAudioManager } from "./IAudioManager";
/**
 * cocos 音频播放管理器
 */
export declare class AudioManagerImpl implements IAudioManager {
    private __audioRoot;
    private __musicChannels;
    private __musicChannelIndex;
    private __soundChannels;
    constructor();
    /**
     * 总音量
     */
    get volume(): number;
    private __volume;
    set volume(value: number);
    /**
     * 音乐总音量控制
     */
    set musicVolume(value: number);
    private __musicVolume;
    get musicVolume(): number;
    /**
     * 声音总音量
     */
    get soundVolume(): number;
    private __soundVolume;
    set soundVolume(value: number);
    set mute(value: boolean);
    private __mute;
    get mute(): boolean;
    get muteMusic(): boolean;
    private __muteMusic;
    set muteMusic(value: boolean);
    get muteSound(): boolean;
    private __muteSound;
    set muteSound(value: boolean);
    private __changedMutes;
    playMusic(url: ResURL, volume: number, speed: number, loop: boolean): void;
    stopMusic(): void;
    pauseMusic(): void;
    resumeMusic(): void;
    playSound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    getPlaying(url: ResURL): IAudioChannel;
    private getIdleChannel;
    tick(dt: number): void;
}
