# DrongoCC
cocos creator + fgui   游戏开发框架库

# 架构层次
          cocos
        /
    drongo-cc
        /
    drongo-fgui
        /
    drongo-gui
# 编译需求
drongo-cc fairygui-cc  编译时有个BUG，不确定是否是Rollup版本导致
错误信息： RollupError: You must specify "output.file" or "output.dir" for the build
通过在rollup.js的normalizeOutputOptions (25097行)方法中的第一行添加 config=config.output
