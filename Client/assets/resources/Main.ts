import { Component, director, game, gfx, JsonAsset, Rect, resources, Sprite, SpriteFrame, sys, Texture2D, view, _decorator } from 'cc';
import { Res, ResRef, RGBA8888Texture, Timer } from 'drongo-cc';
import { GButton, GRoot } from 'drongo-fgui';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    private sprite: Sprite;
    async start() {
        let texture = new RGBA8888Texture(1024, 1024);
        texture.fillRect(0, 0, 1024, 1024, 0xFFFF0000);
        texture.fillRect(100, 0, 100, 100, 0xFFFF00FF);

        this.sprite = this.node.addComponent(Sprite);
        let sf=new SpriteFrame();
        sf.texture=texture;
        this.sprite.spriteFrame=sf;

        let resRef = await Res.getResRef({ url: "001", bundle: "resources", type: Texture2D }, "MainScene");
        if (resRef instanceof ResRef) {
            let t:Texture2D=resRef.content;
            // texture.drawTextureAt2(resRef.content,0,0,t.width,t.height,200,100);
            texture.draw2Texture(resRef.content,0,0,100,100,0,0);
        }
    }

    update(deltaTime: number) {

    }
}