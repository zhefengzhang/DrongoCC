import { ILayer } from "drongo-cc";
import { GComponent } from "drongo-fgui";


export class Layer extends GComponent implements ILayer {

    isFullScrene:boolean;
    openRecord:Array<number>;
    constructor(name: string,isFullScrene:boolean=false) {
        super();
        this.node.name = name;
        this.isFullScrene=isFullScrene;
        this.openRecord=[];
        this.makeFullScreen();
    }
    
    getCount(): number {
        return this.numChildren;
    }
}