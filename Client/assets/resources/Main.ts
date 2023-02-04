import { Component, Rect, Sprite, SpriteFrame, Texture2D, _decorator } from 'cc';
import { Res, RGBA8888Texture } from 'drongo-cc';
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
        sf.rect=new Rect(0,0,100,100);
        this.sprite.spriteFrame=sf;
        
        let resRef = await Res.getResRef({ url: "001", bundle: "resources", type: Texture2D }, "MainScene");
        let t:Texture2D=resRef.content;
        texture.draw2Texture(resRef.content,0,0,100,100,0,0);
    }

    update(deltaTime: number) {

    }
}