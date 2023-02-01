export class ResRef {
    constructor() {
        /**唯一KEY */
        this.key = "";
        /**是否已释放 */
        this.__isDispose = false;
    }
    /**释放 */
    dispose() {
        if (this.__isDispose) {
            throw new Error("重复释放资源引用");
        }
        this.__isDispose = true;
        // ResourceManager.removeResRef(this);
    }
    get isDispose() {
        return this.__isDispose;
    }
    reset() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
        this.__isDispose = false;
    }
    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    destroy() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
    }
}
