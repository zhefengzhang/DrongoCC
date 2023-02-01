export declare class ResRef {
    /**唯一KEY */
    key: string;
    /**引用KEY */
    refKey: string | undefined;
    /**资源内容 */
    content: any;
    /**是否已释放 */
    private __isDispose;
    constructor();
    /**释放 */
    dispose(): void;
    get isDispose(): boolean;
    reset(): void;
    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    destroy(): void;
}
