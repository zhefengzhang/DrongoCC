


export class StringUtils {

    /**
     * 是否为空
     * @param str 
     */
    public static isEmpty(str: string): boolean {
        if (str == null || str == undefined || str.length == 0) {
            return true;
        }
        return false;
    }

    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *  
     *  @example
     *
     *  var str:string = "here is some info '{0}' and {1}";
     *  trace(StringUtil.substitute(str, 15.4, true));
     *
     *  // this will output the following string:
     *  // "here is some info '15.4' and true"
     */
    public static substitute(str: string, ...rest: any[]): string {
        if (str == null) return '';

        // Replace all of the parameters in the msg string.
        var len: number = rest.length;
        var args: any[];
        if (len == 1 && rest[0] instanceof Array) {
            args = rest[0];
            len = args.length;
        }
        else {
            args = rest;
        }

        for (var i: number = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }

        return str;
    }

    /** 
    * 替换全部字符串 
    * @param string src 源串 
    * @param string from_ch 被替换的字符 
    * @param string to_ch 替换的字符 
    *  
    * @return string 结果字符串 
    */
    public static replaceAll(src: string, from_ch: string, to_ch: string): string {
        return src.split(from_ch).join(to_ch);
    }

    /**
     * 拆分字符串
     * @param str 
     */
    public static splitString(str: string, split0: string, split1: string): string[][] {
        let args: string[][] = new Array<string[]>();
        let tmp: string[] = str.split(split0);
        tmp.forEach((val, key) => {
            let s: string[] = val.split(split1);
            args.push(s);
        });
        return args;
    }

    /**
     * 获取文件后缀名
     * @param url 
     */
    static getFileSuffix(url: string): string {
        let index: number = url.lastIndexOf(".");
        if (index < 0) {
            throw new Error(url + "没有后缀！！！");
        }
        let suixx: string = url.substring(index + 1);
        return suixx;
    }

    /**
     * 替换后缀
     * @param url       
     * @param suff      后缀
     * @returns 
     */
    static replaceSuffix(url: string, suff: string): string {
        let index: number = url.lastIndexOf(".");
        if (index < 0) {
            throw new Error(url + "没有后缀！！！");
        }
        let suixx: string = url.substring(index + 1);
        let changeUrl: string = url.replace(suixx, suff);
        return changeUrl
    }
}