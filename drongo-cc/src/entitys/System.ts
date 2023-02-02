import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";
import { Group } from "./Group";


export class System {

    /**
     * 内部接口
     */
    _group: Group;
    
    /**
     * 系统
     * @param allOrAny  所有或任意一个包含
     * @param none      不能包含
     */
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this._group = Group.create(allOrAny, none);
    }

    tick(time: number): void {

    }
}