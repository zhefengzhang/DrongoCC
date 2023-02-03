import { Component, director, game, gfx, JsonAsset, Rect, resources, Sprite, SpriteFrame, sys, Texture2D, view, _decorator } from 'cc';
import { Res, ResRef, Timer } from 'drongo-cc';
import { GButton, GRoot } from 'drongo-fgui';
import { RGBA8888Texture } from './RGBA888Texture';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    private sprite: Sprite;
    async start() {

        let s="001/texture";

        console.log(this.__getURL(s));
        

        // // let texture = new RGBA8888Texture(1024, 1024);
        // // texture.fillRect(0, 0, 1024, 1024, 0xFFFF0000);
        // // texture.update2Texture();

        // this.sprite = this.node.addComponent(Sprite);
        // // this.sprite.spriteFrame = new SpriteFrame();

        // // this.sprite.spriteFrame.texture=texture;
        // // this.sprite.spriteFrame.rect=new Rect(0,0,1024,1024);
        // // GRoot.create();

        // resources.load("001/spriteFrame",SpriteFrame,(err:Error,data)=>{
        //     this.sprite.spriteFrame=data;
        //     console.log(data);
        // })

        // // let resRef = await Res.getResRef({ url: "001", bundle: "resources", type: SpriteFrame }, "MainScene");
        // // if (resRef instanceof ResRef) {
        // //     this.sprite.spriteFrame=resRef.content;

        // //     // this.sprite.spriteFrame.texture = resRef.content;
        // //     // this.sprite.spriteFrame.rect = new Rect(0, 0, resRef.content.width, resRef.content.height);
        // // }
        // // console.log(Timer.absTime);
    }

    private __getURL(key: string): string {
        let len: number = key.length;
        let end: number = len - 8;
        //texture
        let t = key.substring(end);
        if (t === "/texture") {
            return key.substring(0, end);
        }
        end = len - 12;
        t = key.substring(end);
        if (t === "/spriteFrame") {
            return key.substring(0, end);
        }
        return key;
    }

    update(deltaTime: number) {

    }
}