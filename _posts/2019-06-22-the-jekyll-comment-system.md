---
title: Jekyll 评论系统折腾记
date: 2019-06-22 10:36
category: 折腾
keywords: Jekyll博客, Jekyll评论, Staticman
---
评论是一个博客不可缺少的功能——多数人觉得如此，也有极少数人觉得并非如此。我关注的一些国外知名博客（例如：[Zen Habit](https://zenhabits.net/) ）就是没有评论的。没有评论的博客透露着一股孤僻自傲感，阻隔了一切 feedback，无论是批判、赞赏、沟通、交流，还是单纯的吐槽，都无处可泻。

博客从WordPress迁移到Jekyll之后，自然便没了评论，也懒得折腾，就那样放着。在n多个人给我反馈“不能评论不舒服”（外加我本人的“不折腾不舒服”）后，我开启了漫长的评论系统折腾之旅。

静态博客的评论系统似乎还是有很多的：

- **Disqus**：墙内无法使用；
- **Gitment**：我的读者多数不是程序员，哪里有GitHub账号？
- **Valine**：看起来还不错，要是能自定义样式就好了；
- **Gittalk**：依旧需要GitHub账号，但是风格看起来挺不错。

所有这些三方评论系统存在着一个共性问题：评论数据与博客内容本身是分离的。而评论，褒奖也好，贬低也要，无聊的灌水也好，只要不是机器人的垃圾评论，其自产生之日起应当成为博客本身的一部分。

所以最后我选择了 [Staticman](https://staticman.net/)。且先不论Staticman其程序本身存在的那些问题，它的理念是非常好的。

> ## I bring user-generated content to static sites
> ...
> ## I keep your content where it belongs
> ...But as soon as you bring third-party services to the mix, you lose that. You no longer own the content and you suddenly depend on an external platform to deliver some of it.

Staticman 的原理是提供一个 API，当用户发布评论（即提交表单时），它把这些信息按照结构化数据格式写入文件中（Jekyll中通常是`yml`文件），再把文件写入你的Github仓库中。

这可能是最符合静态博客理念的一个三方评论应用，它只提供接口服务，你可以自由设计表单项、表单样式和数据存储结构。即便有一天接口挂掉了（最近就是挂掉了的状态），你的评论依旧会和你的博客在一起，同生共死。

它的最大缺点则是**不稳定**：它的使用者众多（国外居多，国内似乎没什么人用），而作者明显不具备无偿奉献精神，应用部属在免费的三方平台上，所以当请求量过大时，它就会挂掉。

最早使用它时，我还有个VPS来玩耍，就直接把它的开源源码拉到服务器上部署了，好用得没得说。在我的VPS挂掉的前夕，我突然深受 Serverless 精神感动（其实是穷了），决定把博客整体迁出VPS。恰巧那时 Staticman 在众多使用者的忽悠下推出了 v3 接口，解决了 v2 接口无法添加 contributor 便无法使用的问题，我便开开心心地使用起了 v3 接口，关闭了我自己的服务。

刚开始一段时间还挺稳定，后来慢慢地出现了间歇性的评论不上的情况（请求量过大所致）。

在某人再三与我抗议，以及我自己n次无法回复评论之后，我决定寻找 Staticman 的替代品。但我仍旧不想放弃 Staticman 的美好理念，不想放弃已有的评论和我辛辛苦苦设计制作出来的评论框样式。既然没有第三方产品可用，那就自己动手吧！

我的博客是部署在 Netlify 上，Netlify 还有许多高端功能我没有使用的，譬如说表单和基于 AWS 的 `lambda functions`。经研究，这两者相结合是可以实现 Staticman 的评论功能的。

我研究了一下 Staticman 的源码，它设计的初衷就是要兼容多个基于不同SSG和代码仓库的应用，具有很强的灵活性。我要的核心功能还是很简单的：接受表单，验证表单项，生成 `yml` 文件，把文件写入GitHub的代码仓库，用Netlify的lambda function很容易就可实现。

功能很快写完了，但是在Netlify中部署失败了。直到现在我都不知道为什么部署失败。我可以确定不是代码的问题，因为我尝试把官方演示的 `hello.js` 文件部署也是失败。在Stackoverflow 和 Netilfy Community里翻了一大圈都没找到和我出现同样问题的人，我只能到Netlify Community里用我拙劣的英语水平发帖子询问。但是因为与大洋彼岸的时间差的原因，迟迟没有人给我回复。

直到有人出来试图帮我解决时，我已经用 `nodejs` 重写了应用，并成功部署到 Heroku 上了。Heroku 的免费版对于我这样一个简单的应用来说，只要没被恶意攻击，完全够用。就是请求速度比较慢，除了网络通讯的原因，免费版会强制休眠，有请求来时才会启动应用。不过免费的还能奢求些什么呢？

这个自制的 Staticman 的替代品稳定性如何还未知，不过自己写应用最大的好处就是，你可以很容易定位到问题所在，出了问题自己维护，不用指望他人。另外就是，你可以随意折腾。

依旧开源，有需求自取：[jekyll-comment-server](https://github.com/erlzhang/jekyll-comment-server)，后期还会逐渐完善功能（比如：回复邮件通知）。第一次写 `nodejs` 应用，就当写着玩儿吧！

**2020年4月更新：**

Heroku 的国内访问速度实在是不稳定，不时会被墙掉，于是我找到了可替代的国内的服务 leancloud（valine似乎也是基于leancloud，只是与我的理念不符）。leancloud需要使用自己的中间件和api，于是在原来的源码上稍做了改动（拉了个 [leancloud](https://github.com/erlzhang/jekyll-comment-server/tree/leancloud) 分支用于部署）。

