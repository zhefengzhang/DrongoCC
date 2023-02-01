import { director, find, Node } from "cc";
import { TickManager } from "../drongo-cc";
import { ResURL, resURL2Key } from "../res/ResURL";
import { AudioChannel } from "./AudioChannel";
import { AudioManager } from "./AudioManager";
import { IAudioChannel } from "./IAudioChannel";
import { IAudioManager } from "./IAudioManager";




/**
 * cocos 音频播放管理器
 */
export class AudioManagerImpl implements IAudioManager {

    private __audioRoot: Node;

    private __musicChannels: Array<IAudioChannel>;
    private __musicChannelIndex: number = 0;
    private __soundChannels: Array<IAudioChannel>;

    constructor() {
        this.__musicChannels = [];
        this.__soundChannels = [];

        TickManager.addTicker(this);
        this.__audioRoot = find("AudioManager");
        if (this.__audioRoot == null) {
            this.__audioRoot = new Node("AudioManager");
            director.getScene().addChild(this.__audioRoot);
        }

        //音乐用两个轨道来做淡入和淡出
        let channel: IAudioChannel;
        for (let index = 0; index < 2; index++) {
            channel = new AudioChannel(this.__audioRoot);
            this.__musicChannels.push(channel);
        }
    }

    /**
     * 总音量
     */
    get volume(): number {
        return this.__volume;
    }
    private __volume: number = 1;
    set volume(value: number) {
        if (this.__volume == value) {
            return;
        }
        this.__volume = value;
        let channelVolume: number;
        let channel: IAudioChannel;
        for (let index = 0; index < this.__musicChannels.length; index++) {
            channel = this.__musicChannels[index];
            if (channel.isPlaying) {
                channelVolume = channel.volume * this.__musicVolume * this.__volume;
                channel.fade(100, channelVolume, channel.curVolume);
            }
        }
        for (let index = 0; index < this.__soundChannels.length; index++) {
            channel = this.__soundChannels[index];
            if (channel.isPlaying) {
                channelVolume = channel.volume * this.__soundVolume * this.__volume;
                channel.fade(100, channelVolume, channel.curVolume);
            }
        }
    }

    /**
     * 音乐总音量控制
     */
    set musicVolume(value: number) {
        if (this.__musicVolume == value) {
            return;
        }
        this.__musicVolume = value;
        if (this.muteMusic) {
            return;
        }
        let current: IAudioChannel = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            let channelVolume: number = current.volume * this.__musicVolume * this.__volume;
            current.fade(100, channelVolume, current.curVolume);
        }
    }

    private __musicVolume: number = 1;
    get musicVolume(): number {
        return this.__musicVolume;
    }

    /**
     * 声音总音量
     */
    get soundVolume(): number {
        return this.__soundVolume;
    }
    private __soundVolume: number;
    set soundVolume(value: number) {
        if (this.__soundVolume == value) {
            return;
        }
        this.__soundVolume = value;
        let channel: IAudioChannel;
        for (let index = 0; index < this.__soundChannels.length; index++) {
            channel = this.__soundChannels[index];
            if (channel.isPlaying) {
                let channelVolume: number = channel.volume * this.__soundVolume * this.__volume;
                channel.fade(100, channelVolume, channel.curVolume);
            }
        }
    }

    set mute(value: boolean) {
        if (this.__mute == value) {
            return;
        }
        this.__mute = value;
        this.__changedMutes();
    }
    private __mute: boolean;
    get mute(): boolean {
        return this.__mute;
    }

    get muteMusic(): boolean {
        return this.__muteMusic;
    }
    private __muteMusic: boolean;

    set muteMusic(value: boolean) {
        if (this.__muteMusic == value) {
            return;
        }
        this.__muteMusic = value;
        this.__changedMutes();
    }

    get muteSound(): boolean {
        return this.__muteSound;
    }
    private __muteSound: boolean;

    set muteSound(value: boolean) {
        if (this.__muteSound == value) {
            return;
        }
        this.__muteSound = value;
        this.__changedMutes();
    }

    private __changedMutes(): void {
        for (let index = 0; index < this.__musicChannels.length; index++) {
            const element = this.__musicChannels[index];
            element.mute = this.muteMusic || this.mute;
        }
        for (let index = 0; index < this.__soundChannels.length; index++) {
            const element = this.__soundChannels[index];
            element.mute = this.muteSound || this.mute;;
        }
    }

    playMusic(url: ResURL, volume: number, speed: number, loop: boolean): void {
        let playVolume: number;
        if (this.muteMusic || this.mute) {
            playVolume = 0;
        } else {
            //音量=轨道音量*音乐音量*总音量
            playVolume = volume * this.__musicVolume * this.__volume;
        }
        //正在播放的轨道
        let current: IAudioChannel = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            if (resURL2Key(current.url) == resURL2Key(url)) {
                //播放相同的音乐
                return;
            }
        }
        this.__musicChannelIndex++;
        this.__musicChannelIndex = this.__musicChannelIndex % 2;
        let last: IAudioChannel;
        if (this.__musicChannelIndex == 0) {
            current = this.__musicChannels[0];
            last = this.__musicChannels[1];
        } else {
            current = this.__musicChannels[1];
            last = this.__musicChannels[0];
        }
        if (last.isPlaying) {
            last.fade(500, 0, undefined, null, true);
        }
        current.volume = volume;
        current.play(url, null, playVolume, { time: 500, startVolume: 0 }, true, speed);
    }

    stopMusic(): void {
        let current: IAudioChannel = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            current.stop();
        }
    }

    pauseMusic(): void {
        let current: IAudioChannel = this.__musicChannels[this.__musicChannelIndex];
        if (current) {
            current.pause();
        }
    }

    resumeMusic(): void {
        let current: IAudioChannel = this.__musicChannels[this.__musicChannelIndex];
        if (current) {
            current.resume();
        }
    }

    playSound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void {
        let playVolume: number;
        if (this.muteSound || this.mute) {
            playVolume = 0;
        } else {
            playVolume = this.soundVolume * volume * this.__volume;
        }
        let channel: IAudioChannel = this.getIdleChannel();
        if (channel) {
            channel.volume = volume;
            channel.play(url, playedCallBack, playVolume, null, loop, speed);
        }
    }

    getPlaying(url: ResURL): IAudioChannel {
        for (let index = 0; index < this.__soundChannels.length; index++) {
            const element = this.__soundChannels[index];
            if (element.isPlaying && resURL2Key(element.url) == resURL2Key(url)) {
                return element;
            }
        }
        return null;
    }

    private getIdleChannel(): IAudioChannel {
        let index: number;
        let channel: IAudioChannel;
        for (index = 0; index < this.__soundChannels.length; index++) {
            channel = this.__soundChannels[index];
            if (channel.isPlaying == false) {
                return channel;
            }
        }
        if (index < AudioManager.MAX_SOUND_CHANNEL_COUNT) {
            channel = new AudioChannel(this.__audioRoot);
            this.__soundChannels.push(channel);
            return channel;
        }
        return null;
    }

    tick(dt: number): void {
        for (let index = 0; index < this.__musicChannels.length; index++) {
            const element = this.__musicChannels[index];
            if (element.isPlaying) {
                element.tick(dt);
            }
        }
        for (let index = 0; index < this.__soundChannels.length; index++) {
            const element = this.__soundChannels[index];
            if (element.isPlaying) {
                element.tick(dt);
            }
        }
    }
}