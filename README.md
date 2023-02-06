# DrongoCC
cocos creator + fgui   游戏开发框架库
# 架构层次
          cocos
        /
    drongo-cc(自定义基础库)
        /
    drongo-fgui(fgui的复制体，扩展了Tooltip机制和GLoader.url改为自定义类型CCURL)
        /
    drongo-gui(基于上两个库封装的UI系统)
# 编译
drongo-cc fairygui-cc  编译时有个BUG，不确定是否是Rollup版本导致
错误信息： RollupError: You must specify "output.file" or "output.dir" for the build
通过在rollup.js的normalizeOutputOptions (25097行)方法中的第一行添加 config=config.output 来解决编译报错。



# donrog-cc

## Res(资源管理系统)
需要资源时：
~~~ts
Res.getResRef({url:"001",bundle:"resources",type:Texture2D},"引用者名称",progress);
Res.getResRefList(....);
Res.getResRefMap(.....);
~~~
以上接口使用Promise方式封装，所以可以用let result=await Res.getResRef()或then等接口来处理。

#### 为啥要那么多参数？
答：因为使用cocoscreator的AssetBundle系统，可以将资源和代码分包(某些平台不支持代码分包比如：微信)

#### 分包后有啥好处？
答：可以将游戏加载页做的很小，且运行时根据需求动态加载分包。保证内存中有且只有用到的资源。

#### 返回的ResRef是个啥？
答：ResRef是一个资源的引用，当你不需要这个资源了，就可以调用ResRef.dispose()来表示想要释放这个资源，资源管理系统内部会根据引用计数来"智能"的释放资源。
简单举例封装一个Image对象：
~~~ts
//伪代码
export class Image extends Node{
    private __url:ResURL;
    private __ref:ResRef;

    private __sprite:Sprite;

    //....省略sprite的创建

    set url(value:ResURL){
        if(res2Key(value)==res2Key(this.__url)){
            return;
        }
        if(this.__ref){
            this.__ref.dispose();
            this.__ref=null;
        }
        this.__url=value;
        Res.getResRef(this.__url,this.name).then(value=>{
            //不是我要的
            if(value.key!=res2Key(this.__url)){
                value.dispose();
                return;
            }
            this.__ref=value;
            this.sprite.spriteFrame=this.__ref.content;
        },err=>{
            this.__url=null;
        })
    }

    get url():ResURL{
        return this.__url;
    }

    destroy():void{
        super.destroy();
        if(this.__ref){
            this.__ref.dispose();
            this.__ref=null;
        }
    }
}
~~~

通常情况下我们会封装很多类似Image这样的上层类来对Res接口和ResRef进行操作。

## 单向绑定工具类BindingUtils
~~~ ts
    class PlayerData{
        name:string;
        age:number;

        changeNameAndAge(name:string,age:number):void{
            this.name=name;
            this.age=age;
        }
    }

    class UI{
        nameText:string;
        ageText:string;
    }

    class TestMain{
        private player=new PlayerData();
        private ui=new UI();

        private bindingUtils:BindingUtils;
        test():void{

            
            this.bindingUtils=new BindingUtils();
            //属性与属性绑定
            this.bindingUtils.bindAA(this.player,"name",this.ui,"nameText");
            //属性与函数绑定(单属性)
            this.bindingUtils.bindAM(this.player,"name",dataChange,this);
            //属性与函数绑定(多属性)
            this.bindingUtils.bindAM(this.player,["name","age"],dataChange,this);
            //函数与函数绑定
            this.bindingUtils.bindMM(this.player,"changeNameAndAge",
                Handler.create(this,this.preHandler,false),
                Handler.create(this,this.laterHandler,false)
            );

            this.player.name="Greg";
            this.player.age="18";//哈哈永远的18岁
            
            this.player.changeNameAndAge("Greg",18);
        }

        //属性改变时会被调用
        dataChange(changed:Array<string>):void{
            //changed为改变的属性名称
        }

        //player对象的changeNameAndAge执行之前被调用
        preHandler():void{

        }
        //player对象的changeNameAndAge执行之后被调用
        laterHandler():void{

        }
    }
    
~~~