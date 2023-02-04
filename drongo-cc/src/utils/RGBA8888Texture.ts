import { gfx, Texture2D } from "cc";


/**
 * RGBA8888二进制纹理
 */
export class RGBA8888Texture extends Texture2D {

    constructor(width: number, height: number) {
        super();
        this.reset({ width, height, format: Texture2D.PixelFormat.RGBA8888 });
    }

    /**
     * 填充颜色
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param color 
     */
    fillRect(x: number, y: number, width: number, height: number, color: number): void {
        let a = ((color >> 24) & 0xff);
        let r = ((color >> 16) & 0xff);
        let g = ((color >> 8) & 0xff);
        let b = ((color) & 0xff);
        this.__fillRect(x, y, width, height, a, r, g, b);
    }

    private __fillRect(x: number, y: number, width: number, height: number, a: number, r: number, g: number, b: number): void {
        let bytes: Uint8Array = new Uint8Array(width * height * 4);
        let index: number;
        for (let ix = 0; ix < width; ix++) {
            for (let iy = 0; iy < height; iy++) {
                index = (iy * width + ix) * 4
                bytes[index] = r;
                bytes[index + 1] = g;
                bytes[index + 2] = b;
                bytes[index + 3] = a;
            }
        }
        this.copyBuffersToTexture(bytes, x, y, width, height);
    }

    /**
     * 通过颜色分量设置
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     * @param x 
     * @param y 
     */
    setPixel(r: number, g: number, b: number, a: number, x: number, y: number): void {
        this.__fillRect(x, y, 1, 1, a, r, g, b);
    }

    /**
     * 通过单个颜色值设置
     * @param color 
     * @param x 
     * @param y 
     */
    setPixelColor(color: number, x: number, y: number): void {
        let a = ((color >> 24) & 0xff);
        let r = ((color >> 16) & 0xff);
        let g = ((color >> 8) & 0xff);
        let b = ((color) & 0xff);
        this.setPixel(r, g, b, a, x, y);
    }

    /**
     * 将纹理绘制到纹理
     * @param texture 
     * @param sx 
     * @param sy 
     * @param width 
     * @param height 
     * @param tx 
     * @param ty 
     * @param filter 
     * @returns 
     */
    draw2Texture(texture: Texture2D, sx: number, sy: number, width: number, height: number, tx: number, ty: number, filter: gfx.Filter = gfx.Filter.POINT): void {
        //废弃，经过测试blitTexture在微信平台会有颜色覆盖BUG
        // const gfxTexture = texture.getGFXTexture()
        // if (!gfxTexture) {
        //     return;
        // }
        // let region = new gfx.TextureBlit();
        // region.srcOffset.x = sx;
        // region.srcOffset.y = sy;
        // region.srcExtent.width = width;
        // region.srcExtent.height = height;

        // region.dstOffset.x = tx;
        // region.dstOffset.y = ty;
        // region.dstExtent.width = width;
        // region.dstExtent.height = height;
        // gfx.deviceManager.gfxDevice.commandBuffer.blitTexture(gfxTexture, this.getGFXTexture(), [region], filter);

        //先从纹理中获取二进制数据
        let buffer: Uint8Array = new Uint8Array(width * height * 4);
        let region = new gfx.BufferTextureCopy();
        region.texOffset.x = sx;
        region.texOffset.y = sy;
        region.texExtent.width = width;
        region.texExtent.height = height;
        this._getGFXDevice().copyTextureToBuffers(texture.getGFXTexture(), [buffer], [region])
        //然后将二进制数据填充到纹理
        region.texOffset.x = tx;
        region.texOffset.y = ty;
        this._getGFXDevice().copyBuffersToTexture([buffer], this.getGFXTexture(), [region]);
    }

    /**
     * 将二进制数据填充到纹理的指定区域
     * @param buffer 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @returns 
    */
    copyBuffersToTexture(buffer: ArrayBufferView, x: number, y: number, width: number, height: number): void {
        let region = new gfx.BufferTextureCopy();
        region.texOffset.x = x;
        region.texOffset.y = y;
        region.texExtent.width = width;
        region.texExtent.height = height;

        const gfxTexture = this.getGFXTexture();
        if (!gfxTexture) {
            return;
        }
        this._getGFXDevice().copyBuffersToTexture([buffer], gfxTexture, [region]);
    }
}