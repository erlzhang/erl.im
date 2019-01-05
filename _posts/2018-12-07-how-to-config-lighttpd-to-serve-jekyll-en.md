---
layout: post
title:  How to config lighttpd to serve a Jekyll blog?
date: "2018-12-07 21:19:26 +0800"
ref: lighttpd
locale: en
code: true
excerpt: I bought a VPS, with a single core, 10G memories of disk space, and 512M RAM,  in impulse one day. It is obvious that I can't serve any web APPs with that, but it is enough to serve a static blog.
---
I bought a VPS, with a single core, 10G memories of disk space, and 512M RAM,  in impulse one day. It is obvious that I can't serve any web APPs with that, but it is enough to serve a static blog.

My blog used to be served by Github Page when I started to use Jekyll instead of Wordpress. There was a limitation there all plugins written by myself couldn't work unless I pushed them to the Github Page artificially after building locally. Finally, I decided to serve it with my VPS. I set a `callback` in the Github repo so that every time there is something pushed, the server will pull automatically and build the website.

Apache and Nginx are the most popular web servers. I have used the former at work while the latter is commonly used in Wordpress blogs. I chose the Lighttpd partially because of its lightness, partially because I want to try something new.

## Install Lighttpd

**System: Ubuntu 18.04**

```sh
sudo apt-get install lighttpd
```

The version maybe 1.4.50 if you don't set that.

It is so easy to config it after installing. Open the `/etc/lighttpd/lighttpd.conf` which is created automatically, and then fill the root path of your static site after `server.document-root`. The rest of the settings can remain unchanged. I set here the dir `_site` which is the root path Jekyll `build` the pages into.

```conf
server.document-root = "/home/www/_site"
```

Then start the server:

```conf
sudo systemctl start lighttpd
```

You can see your blog's page when you enter your blog's URL in a browser unless the domain isn't well parsed. If you are as lazy as me, or you don't want to do too many things, or what you want is that your blog can be accessed only, you needn't do anything more. I kept the configuration like that for several months.

However, there are plenty of things to do if you'd like to.

## Optimumzation

### 404 Page

It had been several months before I found there wasn't a 404 page on my blog. There was a default `404.html` in your root path when you created a project with Jekyll, but it couldn't work unless you set it in Lighttpd. The option is `server.errorfile-prefix`, which can be a directory or a directory along with a file prefix. Lighttpd will append a `404.html` or `500.html` to that option as the error pages.

For example, if you set `server.errorfile-prefix = "/home/www/error-"`,  `/home/www/error-404.html`  will be the 404 page and  `/home/www/error-500.html` will be the 500 page.

In Jekyll, it can be the same with the root path.

```conf
server.errorfile-prefix = "/home/www/_site/"
```

### Speed

Lighttpd will compress your website pages by default with the module of `mod_compress`, but you should set an expired time to define how long the cached pages will be expired.

#### The Expired Time

You should require the `mod_expire` first.

```conf
server.modules = (
    # ...
    "mod_expire"
)
```

Then you can set the expired time for every kind of assets resources. The configuration is interesting here: `access plus #{ n years/months/days }`. If you want an image to be expired after 30 days, you can write `access plus 30 days`. If it is expired after one day, you should write `days` instead of `day` according to the official website. Don't you think that is a grammar mistake?

How long should we cache the static assets? It depends on your blog. I don't want to think too much about this thing, so I set it `1 years`.

It is ok with images, but as for CSS and JS files which are often changed, you should remember to clear the cached files. I clear the cached files by setting a version number in the `_config.yml` file and append that in the assets file links, such as `main.css?v={{ site.version }}`.

```conf
$HTTP["url"] =~ "^/(assets|img)/" (
    expire.url = ( "" => "access plus 1 years" )
)
```

### 301 Redirect

You may need a 301 redirection often. I used 301 redirections in two ways:

1. Redirect all of my three domains to `yexiqingxi.com`;
2. I changed the format of the permanent links once while some pages have been recorded by Baidu. These recorded links need to be redirected to the new ones.

We can achieve that with Jekyll simply.

First, require the `mod_redirect` in Lighttpd, which has been required by default.

We can try a common requirement here: the SEO optimization recommends you to reserve only one domain between the one with the `www` and the one without the `www`. One should be redirected to the other. Or they will be perceived as two websites other than one by the search engines.

```conf
$HTTP["host"] =~ "^www.yexiqingxi.com$" {
    url.redirect = (
        "^/(.*)" => "http://yexiqingxi.com/$1"
    )
}
```

Then I will teach you how to direct after you change the permanent link formats. The default URLs will be set as the format of  `/year/month/day/title.ext`, which is too long. I changed it to `/blog/title.ext`.

```conf
$HTTP["host"] =~ "^yexiqingxi.com$" {
    url.redirect = (
        "^/2018/\d*/\d*/(.*)" => "http://yexiqingxi.com/blog/$1"
    )
}
```

### HTTPS

I don't think an `https` is needed in a simple blog, but I need one in the authentication in the Netlifycms. So I got an SSL certificate for the `erl.im`. The certificate and its installation are completed by others. I know nothing of the details. So I can only teach you how to config it in Lighttpd.

```conf
$SERVER["socket"] = ":443" {
    ssl.engine = "enable"
    ssl.pemfile = "/etc/.../.../server.pem"
    ssl.ca-file = "/etc/../../fullchain.pem"
    server.document-root = "/home/www/_site"
}
```

Well, that's so simple!

### The Prevention of Stoken Links of Images

We can look up the `referer`s of the requests and reject the access from other websites. You can also redirect that to your home page.

```conf
$HTTP["referer"] !~ "^($|http://yexiqingxi\.com)" {
    url.access-deny = ( ".jpg", ".jpeg", ".png" )
  }
```

If someone wants to require your images on their websites, they will get a `403`. By the way, it is easy to break such protection by simply embedding an `iframe` so that the `referer` will be blank, that seems similar to opening an image in the browser.
