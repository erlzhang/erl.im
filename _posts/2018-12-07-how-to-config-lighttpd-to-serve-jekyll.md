---
title:  基于Lighttpd的Jekyll博客配置及优化
date: "2018-12-07 21:19:26 +0800"
code: true
category: 折腾
keywords: Jekyll, Lighttpd, Ubuntu, 博客优化
description: 怎么使用Lighttpd配置Jekyll博客服务，并进行速度优化、seo优化。
---
某天脑子一热给自己搞了个VPS，单核，10G硬盘，512M内存。这个配置各种web应用基本都不要想了，但是用Jekyll搭建个静态博客还是绰绰有余的。

<!--more-->

从Wordpress转向Jekyll之后，我的博客最早也是托管在Github Page上的。但是Github Page自制插件全部用不了，满足不了需求，只能在本地 `build` 之后再 `push` 到Github Page，很麻烦。最后还是选择部署在服务器上， Github仓库里设一个`callback`，每次 `push` 的操作，服务器都会同步拉取仓库并执行`build`。

市面上常用的webserver当属Apache和Nginx，后者我在工作中用过，前者更是Wordpress标配，最后选定Lighttpd是因为它的轻量级，同时也是本着尝试点新鲜事物的目的。

## 安装Lighttpd

**系统环境：Ubuntu 18.04**

```sh
sudo apt-get install lighttpd
```

自动安装下来的版本应当是1.4.50。

安装好之后配置非常简单，打开系统自动生成的 `/etc/lighttpd/lighttpd.conf` 文件，把 `server.document-root` 改为静态网站的根目录即可，其他都可以保持原配置不变。我这里直接把Jekyll `build` 后的 `_site` 文件夹作为网站根目录。

```conf
server.document-root = "/home/www/_site"
```

然后启动server：

```conf
sudo systemctl start lighttpd
```

如果域名已经成功解析，打开网址直接就可以看到博客。如果你像我一样懒，或不想折腾，或觉得无所谓只想博客能正常访问，那么这样子就可以了——我就这么跑了好几个月！

当然，如果想折腾，可折腾的内容还是很多的。

## 配置优化

### 404页面配置

博客跑了好几个月我才发现没有404页面。Jekyll在创建项目库的时候根目录是会有一个默认的 `404.html`，但Lighttpd这边需要额外的配置。配置的方法是设置 `server.errorfile-prefix` ，可以是一个目录，也可以是一个目录加文件名前缀。Lighttpd会自动给这个路径加上 `404.html` 、`500.html`。

例如，设置 `server.errorfile-prefix = "/home/www/error-"` ，lighttpd会找 `/home/www/error-404.html` 作为404页面， `/home/www/error-500.html` 作为500页面等。

Jekyll 这里和根目录保持一致就可以了。

```conf
server.errorfile-prefix = "/home/www/_site/"
```

### 速度优化

lighttpd默认生成的配置文件里已经开启了文件压缩，即 `mod_compress` 模块。但是需要设置静态资源过期时间。

#### 设置静态资源过期时间

首先，要引入 `mod_expire` 模块。

```conf
server.modules = (
	# ...
	"mod_expire"
)
```

然后针对不同的静态资源设置过期时间，这个配置方法很有意思：`access plus #{ n years/months/days }`。例如 `access plus 30 days` 就是30天之后过期。不过根据官网的demo，1天之后过期也要用 `days` 而不是 `day`，这难道不是语法错误么？

静态资源过期时间设置多久才好？这个是要具体问题具体分析的。不过懒得去考虑这个事情，就直接设置成一年了。

图片不会有什么意外，但css和js经常会有改动，页面引用资源的时候要注意清除缓存，我的方式是，在 `_config.yml` 中设置版本号，例如： `main.css?v={{ site.version }}` 。

```conf
$HTTP["url"] =~ "^/(assets|img)/" (
	expire.url = ( "" => "access plus 1 years" )
)
```

### 301重定向

301重定向是经常会碰见的需求，我的博客就有两处需要用到重定向：

1. 我的三个域名目前都要重定向到 `yexiqingxi.com`；
2. 博客文章的固定链接修改过一次，而原有的文章百度已有收录，要重定向到新链接上。

通过Lighttpd也是非常好实现。

Lighttpd 重定向要引入 `mod_redirect` 模块（默认已经引入）。

先说一个常见的需求：seo优化会建议在带 `www` 的域名和不带 `www` 的中间保留一个，另一个做重定向，不然搜索引擎会把这两个域名看作两个网站。

```conf
$HTTP["host"] =~ "^www.yexiqingxi.com$" {
	url.redirect = (
		"^/(.*)" => "http://yexiqingxi.com/$1"
	)
}
```

顺便说一下修改固定链接之后怎么做重定向。Jekyll默认的文章链接是 `/year/month/day/title.ext` 的形式——太长了，我把它改成了 `/blog/title.ext` 的形式。

```conf
$HTTP["host"] =~ "^yexiqingxi.com$" {
	url.redirect = (
		"^/2018/\d*/\d*/(.*)" => "http://yexiqingxi.com/blog/$1"
	)
}
```

### https

我是觉得一个普普通通的博客没什么必要配个 `https`， 但是之前用的Netlifycms用的登陆认证 `https`，就给 erl.im 搞了个。不过证书的获取和安装都是别人帮我做的，详细的我也不知，我这里就说一下 Lighttpd 要怎么配置吧！

```conf
$SERVER["socket"] = ":443" {
	ssl.engine = "enable"
	ssl.pemfile = "/etc/.../.../server.pem"
	ssl.ca-file = "/etc/../../fullchain.pem"
	server.document-root = "/home/www/_site"
}
```

嗯，就是怎么简单……

### 图片防盗链

原理就是判断请求的 `referer`，非本站请求拒绝访问（也有的是重定向到首页的）。

```conf
$HTTP["referer"] !~ "^($|http://yexiqingxi\.com)" {
    url.access-deny = ( ".jpg", ".jpeg", ".png" )
  }
```

这样外站引用图片时会返回 `403`。顺便说一句，破解这种“反盗链”法也是很容易的，嵌个 `iframe` 就可以了，这样 `referer` 会为空，就和在浏览器里直接打开图片一个道理。
