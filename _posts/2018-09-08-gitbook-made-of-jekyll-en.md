---
layout: post
title: A Multiple Books Generator Inspired by GitBook and Made of Jekyll
date: 2018-09-08 13:23:12 +0800
ref: multibooks
locale: en
code: true
excerpt: I don't think I can express my thought by a blog completely. I can use it to record some fragments conveniently. However, I can't put my novels and books, which contain multiple articles of one topic, in it perfectly.
---
I don't think I can express my thought with a blog entirely. A blog can be used to record some fragments conveniently. However, I can't publish my novels and books, which contain multiple articles of one topic, well with it.

I have searched a lot of ways to publish novels in my old blog powered by *WordPress*. I made a book module in the theme [Dysis](https://github.com/erlzhang/dysis). The chapters were written in `txt` files and rendered by `AJAX`.

I migrated from *WordPress* to *static site generator* then. There is a better container for my novels and books which called *GitBook*. I used the *GitBook* to generate static book pages, and then write a static home page. Then I found some inconveniences:

- If I want to publish a new book, I have to edit the home page first.
- It's hard to be extended. What if I want a blog?

*Gitbook* can be extended by plugins, but there are limitations. It is also hard to be further developed for  I'm not familiar with `nodejs`. So I made a website powered by both of *Gitbook* and *Jekyll*.

I have used *Jekyll* before *Gitbook*. It's convenient to write a plugin. And I'm a *Ruby* programmer. I write a `shell` to combine the functions of both two generators mechanically. However, it is a waste of the disk memory and inconvenient to manage the files. I finally decided to copy the functions of *Gitbook* into a *Jekyll* plugin.

**Principles:** The construction of the source files should be in consonance with those in *Gitbook* so that my site can be migrated from *Gitbook* to *Jekyll* perfectly.

## The construction of source files in Gitbook

- `README.md` is the index page of the book, which should be generated to `index.html`.
- `SUMMARY.md` is the catalog and contains the order and hierarchies of chapters.
- Others are chapters written in `markdown` files and should be parsed normally.

It could be hard to parse the `SUMMARY.md`. I can open the file and read for each line to match with titles and links by `RegExp`. But it's not easy to get the hierarchies and there may be other exceptions. I thought is for a while and found that I can convert the `markdown` file to an `HTML` file by the converter powered by *Jekyll*. Then I can extract what I want with `XPath`.

```ruby
def parse_summary(summary)
  require "nokogiri"

  # Convert the markdown file to HTML by kramdown.
  html = Kramdown::Document.new(summary).to_html

  # Parse it in xpath with nokogiri.
  parsed_html = Nokogiri::HTML(html)

  chapters = []

  # Get the lists.
  list = parsed_html.xpath("//body/ul/li")

  list.each do |li|
    chapter = Hash.new

    # Get the links and titles.
    chapter["link"] = li.xpath("a/@href").to_s
    chapter["title"] = li.xpath("a/text()").to_s
    chapter["level"] = 1
    chapters.push(chapter)

    # At most two nested list here.
    li.xpath("ul/li").each do |sub_li|
      sub_chapter = Hash.new

      sub_chapter["link"] = sub_li.xpath("a/@href").to_s
      sub_chapter["title"] = sub_li.xpath("a/text()").to_s
      sub_chapter["level"] = 2

      chapters.push(sub_chapter)
    end

  end
  # Return a Hash containing the titles, links, and hierarchies.
  return chapters
end
```

## Generator

A `BookGenerator` should contain three types of pages(including home index, book index, and chapters ) which are subclasses of `Page`. Here is the construction of the plugin:

```ruby
module Jekyll
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

The original files should be stored in the directory `_books`.

First, iterate the directories in `_books` and create a instance of `BookPage` with each directory's name.

```ruby
dir = "_books"
Dir.foreach(dir) do |book_dir|
  book_path = File.join(dir, book_dir)
  if File.directory?(book_path) and book_dir.chars.first != "."
    book = BookPage.new(site, site.source, book_dir)
  end
end
```

Second, parse the `SUMMARY.md` and get the chapters' orders and hierarchies.

```ruby
summary = File.read(File.join(book_path, "SUMMARY.md"))
parts = self.parse_summary(summary)
```

Iterate the returned chapters and create instances of `ChapterPage`.

```ruby
chapters = []
book.data["parts"] = []
current = nil

# Create instances of chapters.
parts.each do |part|
  chapter = ChapterPage.new(site, site.source, book_dir, part["link"], book, part)

  # Keep the original hierarchies.
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

Then, iterate the instances of `ChapterPage` to assign a *next page* and a *prev page* to each chapter. (There may be better way to do that without iteration. But I got none.)

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
  # Push the instances of ChapterPage to the pages generating queue.
  site.pages << chapter
end

# The book index should be the prev page of the first chapter.
book.data["next"] = chapters.first
```

Push the instance of `BookPage` to the queue.

```ruby
site.pages << book
```

Finally, generate the home index.

```ruby
book_index = IndexPage.new(site, site.source, "", books)
book_index.render(site.layouts, site.site_payload)
book_index.write(site.dest)
site.pages << book_index
```

There is nothing important to be mentioned in the constructor method of the subclasses of `Page`. Just assign the `layout`, the file names, the names of the directories, and whatever you want. Here is an example of `BookPage`:

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

**Complete Plugin File:** [jekyll-book-generator.rb](https://github.com/erlzhang/persephone/blob/master/_plugins/jekyll-book-generator.rb)
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTgwOTAzMjE4XX0=
-->
