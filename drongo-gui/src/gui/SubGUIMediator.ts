import { GComponent } from "drongo-fgui";
import { BaseMediator } from "./BaseMediator";
import { GUIMediator } from "./GUIMediator";


/**
 * 子UI 逻辑划分
 */
export class SubGUIMediator extends BaseMediator {

    /**所属GUI*/
    owner: GUIMediator;

    constructor(ui: GComponent, owner: GUIMediator) {
        super();
        this.ui = ui;
        this.owner = owner;
        this.init();
        this.inited = true;
    }

    destroy(): void {
        super.destroy();
        this.owner = null;
        this.ui=null;
    }
}
