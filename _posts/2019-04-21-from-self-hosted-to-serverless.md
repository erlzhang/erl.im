---
title: 从self-hosted到Serverless
category: 折腾
date: 2019-04-21 14:30 +0800
keywords: 阿里云oss, Jekyll, Jekyll评论系统, Staticman, Netlify 
---

人生在于折腾，此话不假。一个喜好折腾的人，想要安定下来，也是需要一定的机遇和勇气的。折腾永无止境。

<!--more-->

去年8月购了VPS之后，从部署博客到优化配置折腾了三个月。其实拿VPS部署静态博客完全是在浪费资源，所以在安定了几个月后，我突然又决定把博客迁出VPS，彻底做到serverless。

## 阿里云oss

首先，是将图片放到了阿里云oss上。

促使我决定这样做的原因，是每次commit里含多张图片，push到github上的速度极慢，甚至卡着半天不动，以至于提交失败。

静态博客启用国内图床的很多。本身Github Pages访问速度不稳，图床也带有CDN加速的意味，流量便宜。基于某位同志曾经的惨痛教训，我决定直接启用阿里云。

步骤呢？打开阿里云oss，新建一个bucket，然后把图片文件夹拖进去，搞定！

问题就是Jekyll这边要怎么配置了。

一种方法是手动把图片链接改掉——对于一个程序员来说，这太傻了！

另一种方法是写个脚本，遍历所有markdown文件，把图片链接更改掉——不便于维护，图床地址一旦有更改，都要操作一遍所有的markdown文件。

最终的办法，是不动md文件。写一个`filter`，在`build`的时候，把markdown中的`img`的相对路径改为绝对路径。图床的`base_url`配置在`config.yml`里，在本地环境下设为空，这样我在本地预览调试的时候也不会消耗oss的流量。

## Staticman v3

我想到可以把博客从VPS迁出来，是在发现了Staticman出了v3接口。[Staticman](https://staticman.net/)是我博客的评论引擎，它的功能和特性我在[JAMStack](https://erl.im/blog/blog-made-of-jamstack#评论)这篇文章里已有所提及。v2版本的官方接口，我在调用申请通过contributers接口的时总是失败，无奈之下只能把源码拉到服务器部署。

翻了翻项目主页的issues，我发现无数个人在和作者吐槽这件事（毕竟做静态博客的多数不会搞服务器玩儿），有个人好心地提供了个建议——[使用Github app](https://github.com/eduardoboucas/staticman/issues/243)。这一建议被作者采纳，于是终于有了v3接口，于是我也终于不用在本地部署接口服务了。

只是v3接口发布之后，迟迟没有出文档，只能翻着[issues](https://github.com/eduardoboucas/staticman/issues/243#issuecomment-453754860)踩坑。

作者在issues里提到的v3的接口是：

```
https://dev.staticman.net/v3/entry/github/[USERNAME]/[REPOSITORY]/[BRANCH]
```

实际测试是：

```
https://dev.staticman.net/v3/entry/github/[USERNAME]/[REPOSITORY]/[BRANCH]/comments
```

其他基本不用更改。而且v3支持AJAX请求接口，可以在`staticman.yml`中设置跨域。

```yml
allowedOrigins: ["erl.im"]
```

## Netlify

评论搞定后，剩下的统统交给[Netlify](https://www.netlify.com/)实现就可以了！此前讲过Netlify是个好东西，那时候还只是简单尝试了一下，现在看来，它确实是个好东西。

- 支持第三方Jekyll插件；
- 支持域名绑定，而且可以绑定多个域名；
- 支持301跳转；
- 支持https；
- 支持自定义头部（也就是可以给静态资源设置缓存和过期时间）；
- 支持[netlifycms](https://erl.im/blog/blog-made-of-jamstack#cms)。

目前看来唯一的缺点是`build`的时间较长，有时需要排队，这样评论延迟会比较久——我觉得在我博客评论的人应该也都习惯了。
