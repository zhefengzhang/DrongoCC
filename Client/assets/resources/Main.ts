import { _decorator, Component, Node, JsonAsset } from 'cc';
// import * as dg from "drongo-cc"
import * as fgui from "fairygui-cc"
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {

    }

    update(deltaTime: number) {
        // dg.Res.getResRef({url:"test",bundle:"resources",type:JsonAsset},"MainScene").then((value:dg.ResRef)=>{
        //     console.log(value.content.json);
        // });
    }
}