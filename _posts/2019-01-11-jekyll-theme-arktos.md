---
title: Jekyll 主题 Arktos
date: 2019-01-11 21:46 +0800
category: 折腾
keywords: Jekyll, Jekyll theme, Jekyll主题, jekyll-theme-arktos
---

去年8月开始，我彻底从Wordpress毕业，转向了Jekyll。这一折腾又是大半年，如今折腾累了，差不多也该安定一下了。毕竟，时间和精力都是有限的，排着队要做的事情却有很多。

<!--more-->

这一版博客的主题我是本着超极简风格的目标做的，其极简程度远甚于之前做的两款Wordpress主题。为什么总是倾向于极简风格呢？原因很简单，因为我不是专业设计师，我只是一个程序员。

这一版主题颜色只有黑白灰度，元素只有线条，配合文字图片以及大面积的留白。这样或许有些单调，所以我尽量让线条动起来，可以稍稍弥补颜色欠缺所带来的呆板感。

我把博客部分的样式和页面提取出来，打包成gem，作为Arktos主题发布，给我这一阶段的折腾画上一个尾声。它和你在这个网站里看到的页面会稍有偏差——我删掉了首页、小说、归档等页面，这些内容我觉得对于一个普通的Jekyll博客用户来说没什么必要——此外我增添了一些博客必要的元素。

如果你觉得单单一个博客不够的话，本站的源码也是完全开放，可以来[这里](https://github.com/erlzhang/persephone)获取。不过这个我会改得很随意，毕竟是自己的网站！

如果你对极简的需求和审美恰巧与我相似，且只想要一个简单的博客，可以试一试[Arktos](https://github.com/erlzhang/jekyll-theme-arktos)，我会持续维护。

![Jekyll Theme Arktos](/img/arktos.png)

此外，我在Github Pages上给它单独配了一个预览页，如果你很好奇究竟哪里和这里不一样，可以看看[这里](https://erlzhang.github.io/arktos-demo/)。

## 为什么叫Arktos呢？

这很简单啊，Arktos是古希腊神话里的一个女神名字。如果你看过我的Github，你会发现我的私人项目名很多都是以希腊女神的名字命名的（Dysis也是，Persephone就更不用说了吧！）——这其实并无任何含义，只是一个命名习惯[^1]。

## 以下是详细的使用方法

### 安装

把这行代码加入到你的`Gemfile`中。

```ruby
gem "jekyll-theme-arktos"
```

然后在`_config.yml`中添加：

```yml
theme: jekyll-theme-arktos
```

然后执行：

```sh
$ bundle
```

或者手动安装：

```sh
$ gem install jekyll-theme-arktos
```

如果你是依托于Github Pages build的用户，以上配置都不会生效。不过在`_config.yml`中添加以下一行代码即可替代：

```sh
remote_theme: erlzhang/jekyll-theme-arktos
```

### 用法

主题支持jekyll-pagination-v2，不过你需要先开启分页。

```yml
pagination:
    enabled: true
```

首页默认是不显示摘要的（最好确认一下你的摘要是否正常，我发现Jekyll升级之后自动截取摘要好像失效了），如果想要显示摘要，在`_config.yml`中添加：

```yml
arktos:
  excerpt: true
```

无需插件，即可使用mermaid。方法如下：

<pre>
```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
</pre>

以上看着是不是很眼熟？没错，这就是Github项目主页上部分内容的翻译！

如果有问题和需求可尽情提到[issues](https://github.com/erlzhang/jekyll-theme-arktos/issues)中。

[^1]: 我最开始是叫它Anatole，后来我发现有个Hexo主题起了这个名字，为了避免歧义（同时也是为了主题移植做准备），改名为Arktos。
