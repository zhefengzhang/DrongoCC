import { AudioSource, director, Node } from "cc";
import { Res } from "../drongo-cc";
import { ResRef } from "../res/ResRef";
import { ResURL, url2Key } from "../res/ResURL";
import { IAudioChannel } from "./IAudioChannel";



export class AudioChannel implements IAudioChannel {

    private __node: Node;
    private __source: AudioSource;
    private __isPlaying: boolean;
    private __url: ResURL;

    private __volume: number;
    private __speed: number;
    private __loop: boolean;

    private __startTime: number;
    private __time: number;

    private __fadeData: FadeData;

    private __paused: boolean;
    private __pauseTime: number;
    private __playedComplete: Function;

    private __ref: ResRef;

    private __mute: boolean;

    volume: number;

    constructor(node: Node, source?: AudioSource) {
        if (source == null) {
            source = node.addComponent(AudioSource);
        }
        this.__node = node;
        this.__source = source;
    }

    get url(): ResURL {
        return this.__url;
    }

    get mute(): boolean {
        return this.__mute;
    }

    set mute(value: boolean) {
        if (this.__mute == value) {
            return;
        }
        this.__mute = value;
        if (this.__mute) {
            //记录下来
            this.__volume = this.__source.volume;
            this.__source.volume = 0;
        } else {
            //根据记录设置
            this.__source.volume = this.__volume;
        }
    }

    play(url: ResURL, playedComplete: Function, volume: number, fade?: { time: number, startVolume?: number, complete?: Function, completeStop?: boolean }, loop: boolean = false, speed: number = 1): void {
        this.__reset();
        this.__url = url;
        this.__playedComplete = playedComplete;
        this.__isPlaying = true;

        this.__speed = speed;
        this.__loop = loop;
        if (fade) {
            if (fade.time <= 0) {
                if (this.mute) {
                    this.__volume = volume;
                } else {
                    this.__source.volume = volume;
                }
            }
            if (this.__fadeData == null) {
                this.__fadeData = new FadeData();
            }
            this.__fadeData.startTime = director.getTotalTime();
            this.__fadeData.startValue = fade.startVolume == undefined ? this.__source.volume : fade.startVolume;
            this.__fadeData.time = fade.time;
            this.__fadeData.endValue = volume;
            this.__fadeData.complete = fade.complete;
            this.__fadeData.completeStop = fade.completeStop;
        } else {
            this.__volume = volume;
        }
        //未加载完成前，音频的结束时间为无穷大
        this.__startTime = director.getTotalTime();
        this.__time = Number.MAX_VALUE;

        Res.getResRef(this.url, "AudioChannel").then(
            (value) => {
                if (value instanceof ResRef) {
                    if (this.__isPlaying == false) {
                        value.dispose();
                        return;
                    }
                    let resKey: string = url2Key(this.url);
                    if (resKey != value.key) {
                        value.dispose();
                        return;
                    }
                    this.__ref = value;
                    this.__play();
                }
            },
            (reason) => {
                console.error(reason);
                this.__isPlaying = false;
                this.__source.stop();
                return;
            })
    }

    stop(): void {
        if (this.__source.playing) {
            this.__source.stop();
        }
        this.__isPlaying = false;
        this.__reset();
    }

    get isPlaying(): boolean {
        return this.__isPlaying || this.__source.playing;
    }

    /**
     * 
     * @param time 
     * @param endVolume 
     * @param startVolume 
     * @param complete 
     * @param completeStop 
     * @returns 
     */
    fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void {
        if (!this.isPlaying) {
            return;
        }
        this.__paused = false;
        //立刻
        if (time <= 0) {
            if (this.mute) {
                this.__volume = endVolume;
            } else {
                this.__source.volume = endVolume;
            }
            if (completeStop) {
                this.stop();
                if (complete) {
                    complete();
                }
            }
        } else {
            if (this.__fadeData == null) {
                this.__fadeData = new FadeData();
            }
            this.__fadeData.startTime = director.getTotalTime();
            this.__fadeData.startValue = startVolume == undefined ? this.__source.volume : startVolume;
            this.__fadeData.time = time;
            this.__fadeData.endValue = endVolume;
            this.__fadeData.complete = complete;
            this.__fadeData.completeStop = completeStop;
        }
    }

    private __reset(): void {
        this.__url = null;
        if (this.__ref) {
            this.__ref.dispose();
            this.__ref = null;
        }
        this.__isPlaying = false;
        this.__paused = false;
        this.__fadeData = null;
    }

    private __clipLoaded(err: Error | null, result: ResRef): void {
        if (err) {
            console.error(err.message);
            this.__isPlaying = false;
            this.__source.stop();
            return;
        }
        if (this.__isPlaying == false) {
            result.dispose();
            return;
        }
        let resKey: string = url2Key(this.url);
        if (resKey != result.key) {
            result.dispose();
            return;
        }
        this.__ref = result;
        this.__play();
    }

    private __play(): void {
        this.__source.clip = this.__ref.content;
        this.__source.loop = this.__loop;
        this.__source.play();

        let currentTime: number = director.getTotalTime();
        if (this.__fadeData) {
            this.__fadeData.startTime = currentTime;
            if (this.mute) {
                this.__volume = this.__fadeData.startValue;
            } else {
                this.__source.volume = this.__fadeData.startValue;
            }
        } else {
            if (!this.mute) {
                this.__source.volume = this.__volume;
            } else {
                this.__source.volume = 0;
            }
        }
        this.__startTime = director.getTotalTime();
        this.__time = this.__source.duration * 1000;
        // let audio = this.__source["audio"];
        // if (audio) {
        //     if ("_element" in audio) {
        //         let element = audio["_element"];
        //         if ("_currentSource" in element) {
        //             let currentSource = element["_currentSource"];
        //             if ("playbackRate" in currentSource) {
        //                 let playbackRate = currentSource["playbackRate"];
        //                 if ("value" in playbackRate) {
        //                     playbackRate["value"] = this.__speed;
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    tick(dt: number): void {
        if (this.__paused || this.__isPlaying == false || this.__url == null) {
            return;
        }
        let currentTime: number = director.getTotalTime();
        let passTime: number;
        if (this.__fadeData) {
            passTime = currentTime - this.__fadeData.startTime;
            let value: number = passTime / this.__fadeData.time;
            value = value > 1 ? 1 : value;
            //音量设置
            if (!this.mute) {
                this.__source.volume = this.__fadeData.startValue + (this.__fadeData.endValue - this.__fadeData.startValue) * value;
            } else {
                this.__volume = this.__fadeData.startValue + (this.__fadeData.endValue - this.__fadeData.startValue) * value;
            }
            if (value == 1) {
                let complete: Function = this.__fadeData.complete;
                if (this.__fadeData.completeStop) {
                    this.__source.stop();
                    this.__isPlaying = false;
                    this.__reset();
                }
                if (complete) {
                    complete();
                }
                this.__fadeData = null;
            }
        }

        //循环播放
        if (this.__loop) {
            return;
        }
        //检测是否结束
        passTime = currentTime - this.__startTime;
        let value: number = passTime / this.__time;
        if (value >= 1) {
            //播放完成
            // console.log("播放完成！"+this.__url);
            this.__source.stop();
            this.__isPlaying = false;
            if (this.__playedComplete) {
                this.__playedComplete();
            }
            this.__reset();
        }
    }

    resume(): void {
        if (this.__paused == false) {
            return;
        }
        let pTime: number = director.getTotalTime() - this.__pauseTime;
        if (this.__fadeData) {
            this.__fadeData.startTime += pTime;
        }
        this.__startTime += pTime;
        this.__source.play();
        this.__paused = false;
    }

    pause(): void {
        if (this.__paused) {
            return;
        }
        this.__paused = true;
        this.__pauseTime = director.getTotalTime();
        this.__source.pause();
    }

    get curVolume(): number {
        return this.__source.volume;
    }
}

class FadeData {
    time: number;
    startTime: number;
    startValue: number;
    endValue: number;
    complete: Function;
    completeStop: boolean;
}