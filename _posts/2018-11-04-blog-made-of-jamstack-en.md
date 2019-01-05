---
layout: post
title: Blog Made of Jamstack
date: 2018-11-04 15:23:03 +0800
ref: jamstack
locale: en
code: true
---
What is JAMstack? J means JavaScript, A means API and M is Markup. Here is the official explanation:

> Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.

It is a programming concept that is popular in these years. But I don't know how recent it appeared and how popular it is. At least I haven't known any web apps based on that in China. But in the blog area, it became more and more popular while the Wordpress is outdated and a lot of concepts of website buildings such as serverless, static site generator(SSG), and so on appeared. Somebodies have used it maybe not even know it.

## SSG

I found [Jekyll](https://jekyllrb.com/) after I left Wordpress. Jekyll became the most well-known SSG partially because it is the engine of Github Pages. All those SSGs, including Jekyll, Hexo, and Huge, are the M of the JAMstack. That is Markup.

The SSGs build static pages using conventional markups and processing rule. They use fewer memories of servers to build and with high speed to access. They also can be serverless based on the Github Pages, which attracted a lot of programmers.

However, SSG can't take the place of CMS. Because not everyone is a programmer. Even I, as a programmer, need a CMS sometimes. I may gain an inspiration to write an article every time or find some words to be corrected. But I can't carry a GIT environment everywhere.

Both generators and Markdown are great even with these defections. Then I should find a way to get a CMS for my blog based on the SSG.

## CMS

There are some CMSs for SSG. Jekyll has its official one named [JekyllAdmin](https://github.com/jekyll/jekyll-admin). But I don't think it is easy to use because it lacks a login system.

There are some platforms compatible with the popular SSGs, such as Contentful and Site Leaf. But these platforms are not like CMS. It's not convenient. You need to jump from one site to another. Space is limited. You should pay for it if you need more.

Finally, I found a tool not perfect but easy to use. That is [Netlifycms](https://www.netlifycms.org/).

[Netlify](https://www.netlify.com/) is a good thing too. There is a limitation in Github Pages. Only some of the plugins are permitted in Github Pages but all in Netlify. You can connect it with your Github repository. When something changed in your repository, it will build your site automatically. It can do all what the Github Pages do and what it can't. It is nearly perfect and you can use Netlifycms easily based on it.

I found only one shortage which is the access speed in China. But it is speeder than Github Page.

Netlifycms is a CMS written in React, supporting Jekyll, Hexo and other SSGs. It uses API to access your Github repository and fetch and change the content. It has a login system that you can login with your Github account. The usage is simple:

Create a directory named `admin` in the root. Then create a new page named `index.html` as the index of your CMS. Next, you should include the CDN of Netlify CMS.


```html
  <body>
      <!-- Include the script that builds the page and powers Netlify CMS -->
        <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  </body>
```

Finally, create `config.yml` in your `admin` directory which contains the necessary settings. You needn't do anything then for all needed is done by Netlify CMS. Netlify CMS is open source, so you can `pull` the source code and `build` by yourself. But the speed of CDN is stable even in China.

The biggest problem I found in that procedure is to login. Nelifycms is mainly for Netlify. If you use Netlify it can be built easily, but you will find a challenge if not. It seems that you can use the login system even without Netlify, but I didn't understand the document. I built an authenticate server with the open source code in my VPS.

The principle of Netlify CMS is the J and A of JAM, JavaScript and APIs.

I like the UI of Nelify CMS. But the functions are not perfect. I may improve it by myself if I learned React.

![the index of Netlify CMS](/img/netlifycms_1.jpg)

*Workflow* is one of its features. You can use that if your blog has more than one author. It is based on the `pull request` of Github.


![Netlifycms Workflow](/img/netlifycms_2.jpg)

Rich text editor based on `markdown`. You can use it even if you don't know `markdown`.

![Rich text editor in Netlify CMS](/img/netlifycms_3.jpg)

## CI

Netlify CMS synchronizes your Github repository automatically. But I need to build in VPS after pulling from Github. Every time when something changed, I need to access the server and pull and build, which is so inconvenient. I wondered how Netlify CMS can do that.

I found the answer after some research. It is based on the API of Github. Here is another concept that is related to JAMstack, maybe not so directly. It is **Continous Integration(CI)**.

I found this word in the official website of Jekyll. Jekyll lists some auto-deployment, some of them are based on this. It can solve the problem of Github Page that only a few plugins are permitted in it. Theses CI platforms including Travis CI and Circle CI provide you with mirror spaces. When something changed in your Github repository, it pulls the codes and builds the site, then push it to your Github Page branch. I tried both two platforms and I found them complex and not suitable for a simple blog.

The easy way is to make use of the *Webhooks* of Github. You can find that in the *Settings* of your repository page. When the events are triggered, Github will send `POST` requests to every callback link you add. You can do what you want after your server receives the request.

There is a demo in the [Help Center](https://developer.github.com/webhooks/)of Github, which is written in Ruby and maybe a little complex. I made it quite easily. Execute `git pull && jekyll b` every time received a request no matter what the contents are. Actually, you need to have a check first according to the official document in Github.

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

## Comments

How can you make a blog that can not be commented? Actually, I wonder that for I decided to cut the comments finally. But I had tried to make Jekyll commentable for a while.

Most of the comment of the SSG websites are powered by other tools. Disqus is the wildest used but is blocked in China. We can use duoshuo or youyan instead.

I used none of these tools. It is convenient to use them but the contents didn't belong to you with disharmony. The comments and posts are discrete.

[Staticman](https://staticman.net/) can combine your comments with your Jekyll. It also uses the API of Github to access your repository. This is the progress.

* Include a form to post the comments in your post page. The `action` should be that API provided by Staticman.
* When somebody posts a comment, Staticman write the comment into a `yml` file and push that to your repository.
* Just include theses `yml` files in your post page when `build`.

The point is this API Staticman provided. It is not your Github account, but the account of Staticman. You need to add it to the contributors of your repository. Then open the URL in your browser to let Staticman pass your application of contributor.

```
https://api.staticman.net/v2/connect/{your GitHub username}/{your repository name}
```
The question is after I added the contributor, I tried to request that URL n times in n days but got `invitation not found`. I got the problem in the issues of Staticman that the server is too busy to reply to everyone.

I pull the source codes to my server and built it by myself.

But there were still problems. My blog continuously integrates with my Github repository which needs a period of time. Neither `pull` nor `build` can be completed within a second. The page will reload after submitting the comment but that Jekyll may not complete the building at that time.

I could solve the problem with AJAX but I stopped myself from doing that. I found I didn't need comments.

## Persephone

I have made this blog of Jekyll for about half a year and haven't finished yet. I can't stop doing that. There are still a lot of things to do.

I named the repository of the blog **Persephone**, who is the queen of the Hades. Everybody familiar with the myth of Greek will know her.

I made each of my private projects name of the name of the goddess of the ancient Greek. It is meaningless but just for fun, like other things in my life. Life is meaningless.

Persephone is open source including theme and plugins. You can get the full codes in <https://github.com/erlzhang/persephone> if you are interested in it. There may be bugs in it for I'm not a superior programmer. But the articles and novels are the product of myself. I reserve the copyright.
