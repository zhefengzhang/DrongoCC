import { Component, JsonAsset, _decorator } from 'cc';
import { Res, ResRef, Timer } from 'drongo-cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    async start() {
        // fgui.GRoot.create();
        // Res.getResRef({url:"test",bundle:"resources",type:JsonAsset},"MainScene").then((value:ResRef)=>{
        //     console.log(value.content.json);
        //     value.dispose();
        // });

        let resRef=await Res.getResRef({url:"test",bundle:"resources",type:JsonAsset},"MainScene");
        if(resRef instanceof ResRef){
            console.log(resRef.content.json);
            resRef.dispose();
        }

        console.log(Timer.absTime);
    }

    update(deltaTime: number) {
        
    }
}