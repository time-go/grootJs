GrootJs 前端mvvm框架
=======
###名称来源
名字取 grass 和root 两个单词的组合，既“草根”之意。在创作的中，本着尽量简单实用的原则构思完成的
  
###GrootJs不同于其他mvvm的三大亮点：

1. model模型自动回收。在框架中加入了垃圾回收机制，程序员不回再为了因不断创建大量model不能回收，
  或不便于回收造成内存占用太高而烦恼

2. 全新的变量值变化监模型，改善其他mvvm框架对一些动态数组中得变量变化不便于监控的问题

3. 全新的ui控件开发接口，使控件的值和页面页面模型的值实现同步，操作开发的控件时 就像操作html内置控件一样

###联系方式和技术支持

+ 作者联系方式:qq289880020
+ 官方技术支持QQ群330603020
+ 官网地址http://time-go.github.io/grootJs

### 发布历史
+ 2015-08-04  grootjs 第一个稳定版本1.0发布
+ 2015-12-21  grootjs 1.1版本发布（此版本在原来的基础上进一步对框架性能做了优化）
+ 2016-01-04  grootjs 1.11版本发布（修正特殊字符"\0"的bug）

### 关于精简版GrootJs版本
精简版的是针对研究代码的人单独写的，只保留了最精华的功能，加注释只有142代码。功能：
+ 1.单属性的绑定
+ 2.支持text类型的input
+ 3.支持绑定对象
+ 4.支持数组绑定 对数组的包装只有xxxpush


### 关于GrootJs2.0版本的开发
从发布1.1版本的时刻起，GrootJs 正式进入2.0版本的开发阶段，这个阶段可能会更改一些API设计，因为要加大对组件化开发的支持。
这个版本还会将过时的技术iframe融入其中，因为我在完成对iframe的改造后，发现这员老将真的是太好用了，特别是配合mvvm框架用;
对iframe的独特运用将成为2.0的新的亮点
