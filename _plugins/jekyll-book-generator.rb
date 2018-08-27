module Jekyll

  class IndexPage < Page
    def initialize(site, base, dir, books)
      @site = site
      @base = base
      @dir = dir.gsub(/^_/, "").downcase
      @name = "index.html"

      self.process(@name)

      book_index = File.join(base, "_layouts", "home.html")
      read_yaml(File.dirname(book_index), File.basename(book_index))

      self.data["books"] = books

    end
  end

  class ChapterPage < Page
    def initialize(site, base, dir, name, book, config)
      @site = site
      @base = base

      if name.include?("/")
        names = File.split(name)
        @dir = File.join(dir, names[0])
        @name = names[1]
      else
        @dir = dir
        @name = name
      end

      self.process(@name)

      read_yaml(File.join(base, "_books", @dir), @name)

      self.data["layout"] = 'book'
      self.data["book"] = book

      basename = File.basename(@name, '.md')
      newname = basename + ".html"
      self.data["link"] = File.join(@dir, newname)

      self.data["title"] = config["title"] 
      self.data["level"] = config["level"]
    end
  end

  class BookGenerator < Generator
    def generate(site)

      dir = "_books"

      books = []

      begin

        Dir.foreach(dir) do |book_dir|
          book_path = File.join(dir, book_dir)
          if File.directory?(book_path) and book_dir.chars.first != "."

            # 解析书籍配置
            config_file = File.join(book_path, "book.json")
            config = File.read(config_file)
            book_config = JSON.parse(config)

            book = Hash.new
            book["title"] = book_config["title"]
            book["end"] = book_config["end"]

            if ( book_config["start"] == book_config["end"] ) or ( !book_config["end"] )
              book["date"] = book_config["start"].to_s
            else
              book["date"] = "#{book_config["start"]}-#{book_config["end"]}"
            end

            book["slug"] = book_dir
            
            # 首页仅显示开放状态书籍
            if book_config["open"]
              books << book
            end

            # 创建书籍页面
            summary = File.read(File.join(book_path, "SUMMARY.md")) # 怎么解析它应该是最大的难点
            parts = self.parse_summary(summary)
            chapters = []

            # 生成章节页面
            parts.each do |part|
              chapter = ChapterPage.new(site, site.source, book_dir, part["link"], book, part)
              chapters.push(chapter)
            end

            # 生成summary
            items = self.get_parts(chapters)
            book["index"] = items.shift()
            book["parts"] = items

            # 给章节设定上一页及下一页
            chapters.each_with_index do |chapter, index|
              if index > 0
                chapter.data["prev"] = chapters[index - 1]
              end
              if index < chapters.size - 1
                chapter.data["next"] = chapters[index + 1]
              end
              site.pages << chapter
            end

          end
        end

        gallery = {"title" =>  "Potography", "date" =>  "2016-#{Time.now.year}", "end" => Time.now.year, "slug" =>  "gallery"}

        books.push(gallery)

        books.sort! { |x, y|
          y["end"].to_i <=> x["end"].to_i
        }

        books.each_with_index do |book, index|
          book["current"] = ( index == 0 )
          book["odd"] = ( index % 2 == 0 )
        end

        site.config["books"] = books

        book_index = IndexPage.new(site, site.source, "", books[0..4])
        book_index.render(site.layouts, site.site_payload)
        book_index.write(site.dest)

        site.pages << book_index
      rescue Exception => e
        puts e
      end 
    end

    def get_parts(chapters)
      items = []
      current_item = nil
      chapters.each do |chapter|
        item = Hash.new
        item["title"] = chapter.data["title"]
        item["link"] = chapter.data["link"]
        if chapter.data["level"] == 1
          items.push(item)
          current_item = item
          item["chapters"] = []
        else
          current_item["chapters"].push(item)
        end
      end
      return items
    end

    def parse_summary(summary)
      require "nokogiri"

      html = Kramdown::Document.new(summary).to_html

      parsed_html = Nokogiri::HTML(html)

      chapters = []

      list = parsed_html.xpath("//body/ul/li")

      list.each do |li|
        chapter = Hash.new

        chapter["link"] = li.xpath("a/@href").to_s
        chapter["title"] = li.xpath("a/text()").to_s
        chapter["level"] = 1
        chapters.push(chapter)

        li.xpath("ul/li").each do |sub_li|
          sub_chapter = Hash.new

          sub_chapter["link"] = sub_li.xpath("a/@href").to_s
          sub_chapter["title"] = sub_li.xpath("a/text()").to_s
          sub_chapter["level"] = 2

          chapters.push(sub_chapter)
        end

      end
      return chapters
    end
  end
end
