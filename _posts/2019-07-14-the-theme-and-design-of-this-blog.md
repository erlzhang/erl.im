---
title: 有关博客主题与设计
date: 2019-07-14 10:40 +0800
category: 折腾
keywords: Jekyll theme, jekyll 主题, jekyll 主题设计, jekyll theme persephone
---
大约两个多星期以前，我把现用的Jekyll主题封装成[GEM](https://rubygems.org/gems/jekyll-theme-persephone) [![Gem Version](https://badge.fury.io/rb/jekyll-theme-persephone.svg)](https://rubygems.org/gems/jekyll-theme-persephone) 发布。

自用主题和公共主题会有很多不同：

- 不能只考虑自己的需求，还需要考虑到他人可能的需求（譬如说博客页面右上角的那个导航栏，我从不觉得我的博客需要有这么个事物，但一般博客可能会有需要）；
- 要尽可能做到灵活、可配置化；
- 要考虑到可能的异常情况；
- 还要规划GEM版本，谨慎改动。

两个星期内迭代了6版，修复了一些我的博客上不会出现，但他人使用可能会有的问题。如果没有使用反馈大概不会再更新了——除非我心血来潮又要折腾什么新的功能。

Jekyll主题一般只含样式，插件只能以依赖的方式引入。于是我把原有 `_plugins` 文件夹下的文件，除去不必要的，单独封装成三个插件：

- [jekyll-books](https://github.com/erlzhang/jekyll-books) [![Gem Version](https://badge.fury.io/rb/jekyll-books.svg)](https://rubygems.org/gems/jekyll-books)：仿造Gitbook的书籍生成器（详见[用jekyll模拟gitbook实现多书籍页面生成器](/blog/gitbook-made-of-jekyll)）；
- [jekyll-smiley](https://github.com/erlzhang/jekyll-smiley) [![Gem Version](https://badge.fury.io/rb/jekyll-smiley.svg)](https://rubygems.org/gems/jekyll-smiley)：灵活可配置的评论表情；
- [jekyll-img-prefix](https://github.com/erlzhang/jekyll-img-prefix) [![Gem Version](https://badge.fury.io/rb/jekyll-img-prefix.svg)](https://rubygems.org/gems/jekyll-img-prefix)：给文章内的图片加上外部链接前缀，为了不对原有文章做改动把图片迁移到sso上而写的 `filter`。

我斟酌了一下，没有把他们设成 `jekyll-theme-persephone` 的依赖，因为它们只有对我来说才是必要的，对别人来说未必是。这几个插件都还很粗糙，很多异常情况还未兼顾到，还需进一步完善。

这一番折腾后，博客的[repo](https://github.com/erlzhang/erl.im)中只剩下了文章、评论和少量配置，不似之前样式功能混在一起一团乱，简洁舒心。

这个主题的最初版本是在我弃用了WordPress后，首次尝试Jekyll时随意做出来的，在Github Pages上部署了一阵子。@Baixinho 看过后吐槽“太简单了”，然而这种“太简单了”正是我想要的。

我虽然做过两款自称是“极简风”的WordPress主题，其实与“极简”相去甚远。国外有不少极简风的博客，颜色只有黑白，样式只有线条，配合字体的变化和少量交互动画产生的设计感，依旧美观。

看过大量类似的设计后，我要求自己只使用灰白配色、线条、大面积的留白，不使用色彩（文章内的流程图和代码高亮除外）和阴影渐变。

有些呆板怎么办？

——那就让线条动起来！

说是自设计，还是免不了借鉴（~~东拼西凑~~）。即便是简单的灰白配色，我也做不好，索性扒了Bootstrap4的配色方案。

[Codrops](https://tympanus.net/codrops/) 是我最爱去的前端网站，许多设计和动画灵感都是来源于此。首页的轮播动画的灵感就来源于这个[Reveal Slideshow](https://tympanus.net/Development/RevealSlideshow/) ，动画用的TweenMax（布局写法不同，所以无法直接移植代码），改了许多版，怎么都达不到codrops里demo的流畅度。

后来[博客的首页](/blog)改版后，我直接把 [Image Reveal Hover Effects](https://tympanus.net/Development/ImageRevealHover/) 的源码给扒了下来，便有了现在的hover浮动显示图片的动画效果。这个页面的整体风格则来源于 [Fuck I Wish I Knew That](https://fuckiwishiknewth.at/)。

[归档页](/archive)是仿造 [Perrera.com](http://perrera.com) 。小说内页是由legacy版的[Gitbook](https://legacy.gitbook.com/)基本样式更改而来。

内置svg图标来自 [feather](https://feathericons.com/) 和 [bytesize-icons](https://github.com/danklammer/bytesize-icons)。
 
评论框是最头疼的地方。以前做Dysis的时候，翻遍国内外收费的和免费的WordPress主题，评论部分的设计都是千篇一律。Dysis的评论部分我参考了很多社交系统的评论（尤其是G+），做了不少交互动画。但是那种评论框放到这种版式的博客上不太合适，于是我随意拿线条做了一款简约的，原本还想加些动画效果，但是没想好要怎么动。应某些同志的要求又加上了评论表情的支持。

代码部分，js用了大量ES6语法，使用webpack打包压缩；css是Jekyll内置的sass，大量使用`flex`布局。IE10以下均不支持。

**主题源码及使用文档：** [jekyll-theme-persephone](https://github.com/erlzhang/jekyll-theme-persephone)
