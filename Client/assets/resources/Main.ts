import { _decorator, Component, Node, JsonAsset } from 'cc';
import * as fgui from "fairygui-cc"
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        // fgui.GRoot.create();
        // dg.Res.getResRef({url:"test",bundle:"resources",type:JsonAsset},"MainScene").then((value:dg.ResRef)=>{
        //     console.log(value.content.json);
        // });
    }

    update(deltaTime: number) {
        
    }
}