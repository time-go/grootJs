GrootJs 前端mvvm框架
=======
###名称来源
名字取 grass 和root 两个单词的组合，既“草根”之意。在创作的中，本着尽量简单实用的原则构思完成的
=======
grootjs已经不在维护 新框架qc
  
###GrootJs不同于其他mvvm的三大亮点：

1. model模型自动回收。在框架中加入了垃圾回收机制，程序员不回再为了因不断创建大量model不能回收，
  或不便于回收造成内存占用太高而烦恼

2. 全新的变量值变化监模型，改善其他mvvm框架对一些动态数组中得变量变化不便于监控的问题

3. 全新的ui控件开发接口，使控件的值和页面页面模型的值实现同步，操作开发的控件时 就像操作html内置控件一样

###联系方式和技术支持

+ 作者联系方式:qq289880020
+ 官方技术支持QQ群330603020
+ 官网地址http://time-go.github.io/grootJs
+ 升级版QC http://time-go.github.io/qc

### 发布历史
+ 2015-08-04  grootjs 第一个稳定版本1.0发布
+ 2015-12-21  grootjs 1.1版本发布（此版本在原来的基础上进一步对框架性能做了优化）
+ 2016-01-04  grootjs 1.11版本发布（修正特殊字符"\0"的bug）
+ 2016-01-06  grootjs 2.0版本发布

### 关于精简版GrootJs版本
精简版的是针对研究代码的人单独写的，只保留了最精华的功能，加注释只有142代码。功能：
+ 1.单属性的绑定
+ 2.支持text类型的input
+ 3.支持绑定对象
+ 4.支持数组绑定 对数组的包装只有xxxpush


### 关于GrootJs2.0新功能
+ 1.增加gt-prop指令，用于绑定readonly等类似属性
+ 2.增加groot.UIComponent 更方便的进行组件化开发
+ 3.gt-ui 改为gt-widget
+ 4.在官网的在线示例里封装iframe的用法http://time-go.github.io/grootJs/Demo/

### iframe弹窗函数groot.page(title,url,callback),四个辅助函数
+ groot.msg.render();重新计算弹窗的大小
+ groot.msg.show()
+ groot.msg.close()关闭窗体
+ groot.msg.send(); 向父窗口发送消息，groot.page的回调函数里接受到发来的消息

### groot.page特点
+ 可以和子窗口互动
+ 弹窗里面嵌套弹窗不会有子弹窗卡在父弹窗出不来的问题
