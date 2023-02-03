// import { Texture2D } from "cc";


// /**
//  * RGBA8888二进制纹理
//  */
// export class RGBA8888Texture extends Texture2D {

//     private __buffer: Uint8Array;
//     private __width: number;
//     private __height: number;

//     constructor(width: number, height: number) {
//         super();
//         this.__width = width;
//         this.__height = height;
//         this.__buffer = new Uint8Array(width * height * 4);
//     }

//     fillRect(x:number,y:number,width:number,height:number,color:number):void{
//         for (let ix = 0; ix < width; ix++) {
//             for (let iy = 0; iy < height; iy++) {
//                 this.setPixelColor(color,ix+x,iy+y);
//             }
//         }
//     }

//     /**
//      * 颜色数据写入
//      * @param data 
//      * @param width 
//      * @param height 
//      * @param tx 
//      * @param ty 
//      */
//     setPixels(data: ArrayBufferView, width: number, tx: number, ty: number): void {
//         let x: number, y: number;
//         let tIndex: number;
//         let sIndex: number;
//         let len: number = Math.floor(data.byteLength / 4);
//         for (let index = 0; index < len; index++) {
//             x = index % width;
//             y = Math.floor(index / width);
//             sIndex = (y * width + x) * 4;
//             tIndex = ((ty + y) * this.__width + (tx + x)) * 4;
//             this.__buffer[tIndex] = data[sIndex];
//             this.__buffer[tIndex + 1] = data[sIndex + 1];
//             this.__buffer[tIndex + 2] = data[sIndex + 2];
//             this.__buffer[tIndex + 3] = data[sIndex + 3];
//         }
//     }

//     /**
//      * 通过颜色分量设置
//      * @param r 
//      * @param g 
//      * @param b 
//      * @param a 
//      * @param x 
//      * @param y 
//      */
//     setPixel(r: number, g: number, b: number, a: number, x: number, y: number): void {
//         let index: number = (y * this.__width + x) * 4
//         this.__buffer[index] = r;
//         this.__buffer[index + 1] = g;
//         this.__buffer[index + 2] = b;
//         this.__buffer[index + 3] = a;
//     }

//     /**
//      * 通过单个颜色值设置
//      * @param color 
//      * @param x 
//      * @param y 
//      */
//     setPixelColor(color:number,x:number,y:number):void{
//         let a = ((color >> 24) & 0xff);
//         let r = ((color >> 16) & 0xff);
//         let g = ((color >> 8) & 0xff);
//         let b = ((color) & 0xff);
//         this.setPixel(r,g,b,a,x,y);
//     }

//     /**
//      * 获取矩形范围内的颜色
//      * @param x 
//      * @param y 
//      * @param width 
//      * @param height 
//      * @param result 
//      * @returns 
//      */
//     getPixels(x: number, y: number, width: number, height: number, result?: Uint8Array): Uint8Array {
//         result = result || new Uint8Array(width * height * 4);
//         let fx: number, fy: number;
//         let index: number = 0;
//         let sIndex: number = 0;
//         let color: { a: number, r: number, g: number, b: number };
//         for (let ix = 0; ix < width; ix++) {
//             for (let iy = 0; iy < height; iy++) {
//                 fx = x + ix;
//                 fy = y + iy;
//                 sIndex = ((y + iy) * this.__width + (x + ix)) * 4;
//                 color = this.getPixel(fx, fy);
//                 result[index] = color.r;
//                 result[index+1] = color.g;
//                 result[index+2] = color.b;
//                 result[index+3] = color.a;
//                 index+=4;
//             }
//         }
//         return result;
//     }

//     /**
//      * 获取指定像素点的颜色
//      * @param x 
//      * @param y 
//      * @returns 
//      */
//     getPixel(x: number, y: number): { a: number, r: number, g: number, b: number } {
//         let index: number = (y * this.__width + x) * 4;
//         return {
//             r: this.__buffer[index],
//             g: this.__buffer[index + 1],
//             b: this.__buffer[index + 2],
//             a: this.__buffer[index + 3]
//         };
//     }

//     /**
//      * 将数据同步到纹理
//      */
//     update2Texture(): void {
//         this.initWithData(this.__buffer, Texture2D.PixelFormat.RGBA8888, this.__width, this.__height);
//     }
// }