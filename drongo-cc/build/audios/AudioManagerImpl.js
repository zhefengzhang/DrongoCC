import { director, find, Node } from "cc";
import { TickManager } from "../drongo-cc";
import { resURL2Key } from "../res/ResURL";
import { AudioChannel } from "./AudioChannel";
import { AudioManager } from "./AudioManager";
/**
 * cocos 音频播放管理器
 */
export class AudioManagerImpl {
    constructor() {
        this.__musicChannelIndex = 0;
        this.__volume = 1;
        this.__musicVolume = 1;
        this.__musicChannels = [];
        this.__soundChannels = [];
        TickManager.addTicker(this);
        this.__audioRoot = find("AudioManager");
        if (this.__audioRoot == null) {
            this.__audioRoot = new Node("AudioManager");
            director.getScene().addChild(this.__audioRoot);
        }
        //音乐用两个轨道来做淡入和淡出
        let channel;
        for (let index = 0; index < 2; index++) {
            channel = new AudioChannel(this.__audioRoot);
            this.__musicChannels.push(channel);
        }
    }
    /**
     * 总音量
     */
    get volume() {
        return this.__volume;
    }
    set volume(value) {
        if (this.__volume == value) {
            return;
        }
        this.__volume = value;
        let channelVolume;
        let channel;
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
    set musicVolume(value) {
        if (this.__musicVolume == value) {
            return;
        }
        this.__musicVolume = value;
        if (this.muteMusic) {
            return;
        }
        let current = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            let channelVolume = current.volume * this.__musicVolume * this.__volume;
            current.fade(100, channelVolume, current.curVolume);
        }
    }
    get musicVolume() {
        return this.__musicVolume;
    }
    /**
     * 声音总音量
     */
    get soundVolume() {
        return this.__soundVolume;
    }
    set soundVolume(value) {
        if (this.__soundVolume == value) {
            return;
        }
        this.__soundVolume = value;
        let channel;
        for (let index = 0; index < this.__soundChannels.length; index++) {
            channel = this.__soundChannels[index];
            if (channel.isPlaying) {
                let channelVolume = channel.volume * this.__soundVolume * this.__volume;
                channel.fade(100, channelVolume, channel.curVolume);
            }
        }
    }
    set mute(value) {
        if (this.__mute == value) {
            return;
        }
        this.__mute = value;
        this.__changedMutes();
    }
    get mute() {
        return this.__mute;
    }
    get muteMusic() {
        return this.__muteMusic;
    }
    set muteMusic(value) {
        if (this.__muteMusic == value) {
            return;
        }
        this.__muteMusic = value;
        this.__changedMutes();
    }
    get muteSound() {
        return this.__muteSound;
    }
    set muteSound(value) {
        if (this.__muteSound == value) {
            return;
        }
        this.__muteSound = value;
        this.__changedMutes();
    }
    __changedMutes() {
        for (let index = 0; index < this.__musicChannels.length; index++) {
            const element = this.__musicChannels[index];
            element.mute = this.muteMusic || this.mute;
        }
        for (let index = 0; index < this.__soundChannels.length; index++) {
            const element = this.__soundChannels[index];
            element.mute = this.muteSound || this.mute;
            ;
        }
    }
    playMusic(url, volume, speed, loop) {
        let playVolume;
        if (this.muteMusic || this.mute) {
            playVolume = 0;
        }
        else {
            //音量=轨道音量*音乐音量*总音量
            playVolume = volume * this.__musicVolume * this.__volume;
        }
        //正在播放的轨道
        let current = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            if (resURL2Key(current.url) == resURL2Key(url)) {
                //播放相同的音乐
                return;
            }
        }
        this.__musicChannelIndex++;
        this.__musicChannelIndex = this.__musicChannelIndex % 2;
        let last;
        if (this.__musicChannelIndex == 0) {
            current = this.__musicChannels[0];
            last = this.__musicChannels[1];
        }
        else {
            current = this.__musicChannels[1];
            last = this.__musicChannels[0];
        }
        if (last.isPlaying) {
            last.fade(500, 0, undefined, null, true);
        }
        current.volume = volume;
        current.play(url, null, playVolume, { time: 500, startVolume: 0 }, true, speed);
    }
    stopMusic() {
        let current = this.__musicChannels[this.__musicChannelIndex];
        if (current && current.isPlaying) {
            current.stop();
        }
    }
    pauseMusic() {
        let current = this.__musicChannels[this.__musicChannelIndex];
        if (current) {
            current.pause();
        }
    }
    resumeMusic() {
        let current = this.__musicChannels[this.__musicChannelIndex];
        if (current) {
            current.resume();
        }
    }
    playSound(url, playedCallBack, volume, speed, loop) {
        let playVolume;
        if (this.muteSound || this.mute) {
            playVolume = 0;
        }
        else {
            playVolume = this.soundVolume * volume * this.__volume;
        }
        let channel = this.getIdleChannel();
        if (channel) {
            channel.volume = volume;
            channel.play(url, playedCallBack, playVolume, null, loop, speed);
        }
    }
    getPlaying(url) {
        for (let index = 0; index < this.__soundChannels.length; index++) {
            const element = this.__soundChannels[index];
            if (element.isPlaying && resURL2Key(element.url) == resURL2Key(url)) {
                return element;
            }
        }
        return null;
    }
    getIdleChannel() {
        let index;
        let channel;
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
    tick(dt) {
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
