export interface ITicker {
    /**
     * 心跳
     * @param dt  间隔时间(秒)
     */
    tick(dt: number): void;
}
