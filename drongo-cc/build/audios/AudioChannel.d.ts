import { AudioSource, Node } from "cc";
import { ResURL } from "../res/ResURL";
import { IAudioChannel } from "./IAudioChannel";
export declare class AudioChannel implements IAudioChannel {
    private __node;
    private __source;
    private __isPlaying;
    private __url;
    private __volume;
    private __speed;
    private __loop;
    private __startTime;
    private __time;
    private __fadeData;
    private __paused;
    private __pauseTime;
    private __playedComplete;
    private __ref;
    private __mute;
    volume: number;
    constructor(node: Node, source?: AudioSource);
    get url(): ResURL;
    get mute(): boolean;
    set mute(value: boolean);
    play(url: ResURL, playedComplete: Function, volume: number, fade?: {
        time: number;
        startVolume?: number;
        complete?: Function;
        completeStop?: boolean;
    }, loop?: boolean, speed?: number): void;
    stop(): void;
    get isPlaying(): boolean;
    /**
     *
     * @param time
     * @param endVolume
     * @param startVolume
     * @param complete
     * @param completeStop
     * @returns
     */
    fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void;
    private __reset;
    private __clipLoaded;
    private __play;
    tick(dt: number): void;
    resume(): void;
    pause(): void;
    get curVolume(): number;
}
