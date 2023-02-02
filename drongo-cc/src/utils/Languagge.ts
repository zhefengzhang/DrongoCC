import { StringUtils } from "./StringUtils";




export class Language {

    /**
    * 当前语言
    */
    static language: string = "zh_cn";

    /**
     * 语言数据
     */
    private static langPacks: any = {};

    /**
     * 初始化
     * @param langPacks 
     */
    static init(langPacks: any): void {
        this.langPacks = langPacks;
    }

    /**
     * 转换文字语言
     */
    static traslate(value: string, ...rest: any[]): string {
        let langeValue: string;
        if (this.langPacks) {
            langeValue = this.langPacks[value] || value;
        } else {
            langeValue = value;
        }
        return StringUtils.substitute(langeValue, rest);
    }

    /**
     * 替换参数
     * substitute("你好{0},你吃{1}了吗?","蝈蝈","饭")
     * 返回 你好蝈蝈你吃饭了吗?
     * @param value 
     * @param rest 
     * @returns
     */
    static substitute(value: string, ...rest: any[]): string {
        return StringUtils.substitute(value, rest);
    }
}