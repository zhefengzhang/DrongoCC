import { Dictionary } from "../containers/Dictionary";
import { Entity } from "./Entity";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";

export class Group {

    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf;

    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf;

    /**
     * 编组所匹配的元素(内部接口)
     */
    _entitys: Dictionary<string, Entity> = new Dictionary<string, Entity>();

    private __id: string;

    constructor() {

    }

    init(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf): void {
        this.matcher = allOrAny;
        this.matcherNoneOf = none;
        if (none) {
            this.__id = "id:" + this.matcher.flags + "|" + none.flags;
        } else {
            this.__id = "id:" + this.matcher.flags;
        }
    }

    get id(): string {
        return this.__id;
    }


    private static __pool: Array<Group> = [];

    static create(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf): Group {
        let result: Group;
        if (this.__pool.length) {
            result = this.__pool.shift();
        } else {
            result = new Group();
        }
        result.init(allOrAny, none);
        return result;
    }

    static recycle(value: Group): void {
        let index: number = this.__pool.indexOf(value);
        if (index >= 0) {
            throw new Error("重复回收!");
        }
        this.__pool.push(value);
    }
}