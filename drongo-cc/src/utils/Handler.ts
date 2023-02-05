


/**
 * 处理器
 */
export class Handler {
    method: Function;
    caller: any;
    once: boolean = true;
    private isOver:boolean;

    run(...args:any[]) {
        if (this.method && !this.isOver) {
            this.method.apply(this.caller, args);
            if (this.once) {
                this.isOver = true;
            }
        }
    }

    equal(value: Handler): boolean {
        if (this.method == value.method && this.caller == value.caller) {
            return true;
        }
        return false;
    }

    static create(caller: any, method: Function | null, once?: boolean): Handler {
        var h = new Handler();
        h.caller = caller;
        h.method = method;
        h.once = once;
        h.isOver = false;
        return h;
    }
}