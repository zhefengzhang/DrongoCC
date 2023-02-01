import { ResURL } from "../res/ResURL";

/**
 * 音频通道
 */
export interface IAudioChannel {

    readonly isPlaying: boolean;

    readonly url: ResURL;

    readonly curVolume: number;

    /**
     * 音量
     */
    volume: number;

    mute: boolean;

    /**
     * 播放
     * @param url 
     * @param playedComplete 
     * @param volume 
     * @param fade 
     * @param loop 
     * @param speed 
     */
    play(url: ResURL, playedComplete: Function, volume: number, fade: { time: number, startVolume: number, complete?: Function }, loop: boolean, speed: number): void;

    /**
     * 停止
     */
    stop(): void;

    /**
     * 
     * @param time 
     * @param startVolume 
     * @param endVolume 
     * @param complete
     * @param completeStop  结束后是否停止播放
     */
    fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void;

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void;

    pause(): void;

    resume(): void;
}