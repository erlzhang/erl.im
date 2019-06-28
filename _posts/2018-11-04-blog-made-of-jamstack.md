---
title: JAMstack博客搭建
date: 2018-11-04 15:23:03 +0800
code: true
category: 折腾
keywords: JAMstack, Jekyll, Netlify CMS, 静态网页生成器, serverless, GitHub
description: 基于JAMstack搭建serverless静态博客理念及方法分享。
---
何谓JAMstack？J即JavaScript，A即APIs，M即Markup，官方解释如下：

<!--more-->

> Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.

翻译过来就是：

> 基于客户端的JavaScript，可以复用的API，及预生成的Markup的现代web开发架构。

是近些日子流行起来的编程概念，究竟近到什么程度和流行到什么程度我就不知道了，至少在我所了解的国内web开发没有基于这种概念性架构的。但是在博客界，随着Wordpress所代表的传统cms的没落，serverless、static site generator（静态网站生成器，以下简称SSG）等概念的兴起，JAMstack也逐渐流行起来。许多人可能对JAMstack这个概念还有些生疏，但已经符合JAMstack的架构理念了。

## SSG

在放弃了Wordpress之后，我首先转向了[Jekyll](https://jekyllrb.com/)。Jekyll是最流行的SSG，它的流行与Github Pages密不可分。不论是Jekyll、Hexo或是Huge，它们都代表了JAM中的M，即Markup。

SSG就是通过一些约定俗成的标记和转换规则构建静态网页，耗费资源少，访问速度快，再加上Github Pages等平台的兴起使得网站可以做到serverless，引得大批程序员的青睐。

但SSG终究代替不了cms，因为不是每个人都是程序员。即便是我也有cms的需求。我可能随时都有灵感产生，都想写文章，或是临时发现某个错别字需要做改动，但我不会随身携带着git环境。

即便有这些固有的缺陷，生成器依然棒棒的，markdown也仍然棒棒的。剩下就看SSG怎么实现CMS的功能了！

## CMS

基于SSG的cms系统如今已经不少了，Jekyll就有一个官方的[JekyllAdmin](https://github.com/jekyll/jekyll-admin)，不算很好用，且缺少开箱即用的登陆方案。

有一些第三方平台也做到了和市面上流行的SSG做无缝对接，例如Contentful和Site Leaf，但第三方平台终究不像cms，还需要从一个网站跳到另一个网站，多麻烦！且有资源量限制，超过就要收费了。

最后我发现了一个不算完美但非常好用的东西：[Netlifycms](https://www.netlifycms.org/)。

[Netlify](https://www.netlify.com/)也是个好东西。GitPage本身有局限性，不能运行第三方插件，Netlify却可以，可以自动同步GitHub上的内容，内容有变动的时候自动 `build`，支持自定义域名，支持https。Github Pages能做到的，它都做到了；Github Pages做不到的，也都做不到了，加上Netlifycms的无缝衔接，堪称完美。

要说缺点只有一个：国内访问速度不稳。其实也不算很慢，比Github Pages快一些。

要不是我在发现它之前已经搞了个服务器，我就选定它了，也免了很多折腾（也可能因为我天生就喜欢折腾）。

Netlifycms是一个React构建的cms，支持包括Jekyll、Hexo等常用的SSG。它的原理是利用api同步或修改GitHub代码仓库的文件内容，同时提供了一套与GitHub账号对接的登录认证系统。基本的使用方法很简单：

在你的根目录下创建一个 `admin` 文件夹，新建一个 `index.html` 作为管理后台的首页，然后在这个页面引入Netlifycms的cdn文件即可。

```html
  <body>
      <!-- Include the script that builds the page and powers Netlify CMS -->
        <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  </body>
```

然后在同一个文件夹下面创建一个 `config.yml` 文件，这个文件写一些必要的配置。余下的什么都不用管，Netlifycms都帮你做了。Netlifycms完全开源，你可以把源码`pull`下来自己`build`后直接扔到代码库里。不过亲测它的cdn访问速度还是很稳定的。

在这个过程中我遇到的最大问题是登录。Netlifycms是为Netlify准备的，它和Netlify的登录系统无缝衔接。对于不使用Netlify的人来说，就要折腾一番了。根据它的说明文档，似乎也可以使用Netlify的认证系统，不过我没太看明白。最后我是利用第三方开源的源码自己在服务器搭建了一个认证系统，也颇费了一番功夫。

总结下Netlifycms的原理，就是JAM中的JA：JavaScript + APIs。

Netlifycms的UI设计也非常漂亮，就是功能还不够灵活。可惜我不太懂React，不然有得折腾了。

![Netlifycms后台主页](/img/netlifycms_1.jpg)

它的Workflow功能也是个亮点，可以用于多人协作，其原理是利用GitHub的pull request功能。

![Netlifycms Workflow](/img/netlifycms_2.jpg)

基于`markdown`的富文本编辑器，不懂 `markdown `的人也可以使用。

![Netlifycms 富文本编辑器](/img/netlifycms_3.jpg)

## CI

Netlifycms是同步或更改GitHub上的内容，而我的Jekyll站是从GitHub拉到服务器再build的。那么每次更新内容的时候，还要到服务器上去pull和build，这更加麻烦了。这让我很好奇Netlify是怎么在GitHub内容变动的时候都能自动更新并部署代码的。

经过一番调研，发现这也没什么神奇的。要说神奇也是神奇在GitHub，Netlify只是充分利用了GitHub的功能。这里又引入了一个概念，也是没体现在JAMstack中，但与JAMstack密不可分的：Continuous Integration（持续集成，以下简称CI）。

CI这个概念，我是从Jekyll的官网中看到的，是Jekyll为自动化部署提供的方案。GitPage不能使用第三方插件，但第三方的CI服务可以解决这个问题，常用的包括Travis CI、CircleCI。它的原理是提供一个镜像空间，在代码仓库有变动的时候，把代码拉过去，在镜像空间里build之后再部署到GitPage。上述两个平台我都尝试过，但对于博客来说真的是大材小用了。

简单的办法就是利用GitHub提供的Webhooks功能，你在项目库的Settings里可以发现这个选项。当这个项目相关的事件被触发时，GitHub会向你在这个配置里添加的每一条url发送一条 `POST`请求。你可以设定让服务器在接受请求之后做你想做的事情。

GitHub的[帮助中心](https://developer.github.com/webhooks/)有相关的demo，Ruby语言的，不过功能挺复杂。我这里非常简单，接受到push通知请求后，不管三七二十一，直接 `git pull && jekyll b`，非常简单粗暴。按照Jekyll官网上的demo，最好先检查一下文件完整性什么的。我这个确实过于简单了，也没加认证拦截。

```ruby
require 'sinatra'
require 'json'

class CIServer < Sinatra::Base
  configure :production, :development do
    enable :logging
  end

  post '/event_handler' do
    @payload = JSON.parse(params[:payload])

    logger.info "request:#{request.env['HTTP_X_GITHUB_EVENT']}"

    case request.env['HTTP_X_GITHUB_EVENT']
    when "push"
      logger.info "start pulling and building"
      system "git pull; jekyll b"
    end
  end
end
```

## 评论

博客怎么可能少了评论系统呢——对于这句话我当然是存疑的，因为经过了一番权衡之后，我还是放弃了评论功能——不过毕竟是折腾过的。

大多数基于SSG的站点想要实现评论功能，都要基于第三方工具。墙外有disqus一统天下，墙内也有多说、友言这一类的第三方评论工具。

我一开始就没考虑过第三方。第三方的即便用起来方便，看上去就不是自己的。和自己的博客放在一起总有些违和感。而且最关键的一点：它的评论内容与博客本身是分离的。

有一个叫[Staticman](https://staticman.net/)的东西，将评论和Jekyll很好地结合在了一起。它的原理仍旧是利用API访问GitHub上的代码仓库，过程如下：

* 在你的博客文章页面里加一个评论提交表单，表单的`action`设置为Staticman提供的API；
* 提交表单时，Staticman会将你的评论内容写在一个`yml`文件，并提交到你的代码仓库里；
* `build`博客页面时，把对应的`yml`按照一定顺序引入即可。

全部的关键就在于Staticman提供的这个接口。它不是利用你的GitHub账号，而是统一使用一个Staticman的账号，你需要先把这个账号加入的项目库的contributers里，然后在浏览器里打开下面这个url，用于让Staticman通过你的contributers申请。

```
https://api.staticman.net/v2/connect/{your GitHub username}/{your repository name}
```

问题来了，我把contributer加好了，在n天内n次请求这个url，都返回 `invitation not found`。于是到Staticman项目库的issues里去翻，发现很多人都有这个问题，估计是请求的人太多，服务器处理不过来了。

于是漫长的折腾之路又开始了。我把staticman的源码拉到服务器上，自己搭建好了接口，成功了实现了评论功能。

然而问题又来了：我的博客是服务器持续集成的，集成需要时间。不论是请求接口还是pull还是build都不是毫秒级的。表单提交之后页面会刷新，而这时候还没`build`好呢……

通过异步表单可以一定程度上解决这个问题，不过我止步于此了——通过一番权衡判断，我发觉自己根本不需要评论，也不想要评论。就这个话题完全可以写满一篇文章，就不在这里陈述了。

## Persephone

Jekyll这个博客我前后折腾了能有半年，至今仍未结束，折腾的天性让我不可能停止折腾的脚步。没有了wordpress，还有Jekyll；没有Jekyll还会有其他的替代品，折腾永无止境。

我把这个博客的项目库起名为**Persephone**，佩尔塞福涅，熟悉希腊神话的应该都知道，冥界主宰哈德斯（抢来的）的妻子，大名鼎鼎的冥后。

从Dysis开始，我自己的项目几乎都以希腊女神命名，没什么深意，只是觉得好玩儿。就好像我的折腾很多都是毫无意义的一样，只是我生活中的一部分。生活本就是毫无意义。

Persephone从主题到插件完全开源，有兴趣的可以自行看看：<https://github.com/erlzhang/persephone>。我不是个优秀的程序员，有些地方可以说写得很烂，自行斟酌。至于文章和小说，好坏都是我的心血，麻烦尊重版权。
