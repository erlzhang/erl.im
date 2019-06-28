---
title: 用jekyll模拟gitbook实现多书籍页面生成器
date: 2018-09-08 13:23:12 +0800
code: true
category: 折腾
keywords: Jekyll, Gitbook, Jekyll插件, 多书籍网站生成器
description: 分享一个Jekyll插件的写作思路和示例代码，功能是模拟gitbook生成书籍的功能做成多书籍网站生成器。
---
我一直觉得，博客的表达方式是不完整的。它方便处理一些零散的思想和记录，但对于小说以及可以依据某一主题归纳为文集的内容难以承载。

<!--more-->

之前用 *wordpress* 的时候，我就一直在考虑，究竟用什么方式来发布更新小说比较好，于是在 *Dysis* 主题里有了小说模块，是用 `AJAX` 异步获取txt文件，本质上是个静态文件。

如今弃用 *wordpress* ，转向静态页面生成器，最适合承载小说和文集的是gitbook。用gitbook生成静态书籍页面，然后制作静态首页，这是我不久之前的做法。这样有很多不便：

- 添加书籍要手动更新首页页面，比较麻烦;
- 不方便扩展功能，例如：我还是想要个博客呢？

gitbook有提供插件接口，但功能有限，我对nodejs不算很熟悉，二次开发也有难度。于是我首先想到把jekyll和gitbook结合起来。

jekyll我在gitbook前就试用过，开发插件很方便。ruby是我们公司通用的后端语言，熟悉且开发方便。最初是用shell脚本机械地结合两个生成器的功能，很麻烦，且浪费资源。最终选定的方案是，用jekyll插件实现gitbook的基本功能。

**原则：** 静态资源结构和gitbook差别不要太大，方便迁移。

## gitbook的文件结构

- `README.md` 基本是首页，生成之后是 `index.html`;
- `SUMMARY.md` 是目录页，用来确定章节顺序及层级关系;
- 其他就是章节的 `markdown` 文件，正常解析就好。

难点在于解析 `SUMMARY.md` 文件，我最早想的是读取每一行内容然后匹配正则确定标题和链接，但层级关系并不好确定，还需要考虑很多异常情况。后来才想到，既然是 `markdown` 文件，大可以用jekyll自带的解析器解析成 `html` ，再利用 `xpath` 提取内容。

```ruby
def parse_summary(summary)
  require "nokogiri"

  # 先用kramdown把markdown转化为html
  html = Kramdown::Document.new(summary).to_html

  # 利用nokogiri来解析xpath
  parsed_html = Nokogiri::HTML(html)

  chapters = []

  # 提取列表
  list = parsed_html.xpath("//body/ul/li")

  list.each do |li|
    chapter = Hash.new

    # 提取链接、标题
    chapter["link"] = li.xpath("a/@href").to_s
    chapter["title"] = li.xpath("a/text()").to_s
    chapter["level"] = 1
    chapters.push(chapter)

    # 最多支持二级嵌套关系
    li.xpath("ul/li").each do |sub_li|
      sub_chapter = Hash.new

      sub_chapter["link"] = sub_li.xpath("a/@href").to_s
      sub_chapter["title"] = sub_li.xpath("a/text()").to_s
      sub_chapter["level"] = 2

      chapters.push(sub_chapter)
    end

  end
  # 返回包含标题、链接及层级关系的Hash
  return chapters
end
```

## 生成器

一个book生成器生成三个页面（首页、书籍页、文章页），继承jekyll的 `Page` 类。文件结构如下：

```ruby
module jekyll
  class IndexPage < Page
  end

  class BookPage < Page
  end

  class ChapterPage < Page
  end

  class BookGenerator < Generator
  end
end
```

书籍的原始文件存在 `_books` 文件夹下。

首先，遍历 `_books` 文件夹下的全部文件夹，创建 `BookPage`实 例。

```ruby
dir = "_books"
Dir.foreach(dir) do |book_dir|
  book_path = File.join(dir, book_dir)
  if File.directory?(book_path) and book_dir.chars.first != "."
    book = BookPage.new(site, site.source, book_dir)
  end
end
```

然后解析 `SUMMARY.md` 文件，得到章节顺序及层级结构。

```ruby
summary = File.read(File.join(book_path, "SUMMARY.md"))
parts = self.parse_summary(summary)
```

遍历返回的章节数据，依次创建 `ChapterPage` 实例。

```ruby
chapters = []
book.data["parts"] = []
current = nil

# 生成章节页面
parts.each do |part|
  chapter = ChapterPage.new(site, site.source, book_dir, part["link"], book, part)

  # 构建层级关系
  if part["level"] == 1
    book.data["parts"].push(chapter)
    current = chapter
    chapter.data["parts"] = []
  else
    current.data["parts"].push(chapter)
  end
end
chapters.push(chapter)
```

给章节设定上一章和下一章，这里需要再遍历一遍`ChapterPage`实例（可能还有不用遍历的更好办法，我没想出来）。

```ruby
chapters.each_with_index do |chapter, index|
  if index > 0
    chapter.data["prev"] = chapters[index - 1]
  else
    chapter.data["prev"] = book
  end
  if index < chapters.size - 1
    chapter.data["next"] = chapters[index + 1]
  end
  # 把ChapterPage扔到生成页面的队列里
  site.pages << chapter
end

# 第一章的前一页就是书籍页面
book.data["next"] = chapters.first
```

把`BookPage`扔到页面队列里。

```ruby
site.pages << book
```

最后要创建首页。

```ruby
book_index = IndexPage.new(site, site.source, "", books)
book_index.render(site.layouts, site.site_payload)
book_index.write(site.dest)
site.pages << book_index
```

几个`Page`的子类没什么好说的，就是需要指定`layout`，指定生成页面的目录和名称，然后根据需要预设一些数据。这里仅以`BookPage`为例。

```ruby
class BookPage < Page
  def initialize(site, base, dir)
    @site = site
    @base = base
    @dir = dir.gsub(/^_/, "").downcase
    @name = "index.md"

    self.process(@name)

    read_yaml(File.join(@base, "_books", @dir), @name)

    self.data["layout"] = 'book'

    if ( self.data["start"] == self.data["end"] ) or ( !self.data["end"] )
      self.data["date"] = self.data["start"].to_s
    else
      self.data["date"] = "#{self.data["start"]}-#{self.data["end"]}"
    end

    self.data["link"] = @dir

    self.data["slug"] = @dir
  end
end
```

**完整代码：** [jekyll-book-generator.rb](https://github.com/erlzhang/persephone/blob/master/_plugins/jekyll-book-generator.rb)
