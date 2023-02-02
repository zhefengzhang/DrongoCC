import { BitFlag } from "../../utils/BitFlag";
import { IMatcher } from "./IMatcher";




export class Matcher extends BitFlag implements IMatcher {

    constructor(flags: Array<number>) {
        super();
        for (let index = 0; index < flags.length; index++) {
            this.add(flags[index]);
        }
    }
}