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

      self.data["title"] = "首页"

      self.data["books"] = books

    end
  end

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

      self.data["layout"] = 'chapter'
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

      archive = []

      begin

        Dir.foreach(dir) do |book_dir|
          book_path = File.join(dir, book_dir)
          if File.directory?(book_path) and book_dir.chars.first != "."
            book = BookPage.new(site, site.source, book_dir)

            # 创建书籍页面
            summary = File.read(File.join(book_path, "SUMMARY.md"))
            parts = self.parse_summary(summary)

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

              chapters.push(chapter)
            end

            # 给章节设定上一页及下一页
            chapters.each_with_index do |chapter, index|
              if index > 0
                chapter.data["prev"] = chapters[index - 1]
              else
                chapter.data["prev"] = book
              end
              if index < chapters.size - 1
                chapter.data["next"] = chapters[index + 1]
              end
              site.pages << chapter
            end

            book.data["next"] = chapters.first

            # 首页仅显示开放状态书籍
            if book.data["open"]
              archive << book
            end

            site.pages << book

          end
        end

        archive.sort! { |x, y|
          y.data["end"].to_i <=> x.data["end"].to_i
        }

        archive.each_with_index do |book, index|
          book.data["current"] = ( index == 0 )
          book.data["odd"] = ( index % 2 == 0 )
        end

        site.config["archive"] = archive

        book_index = IndexPage.new(site, site.source, "", archive[0..4])
        book_index.render(site.layouts, site.site_payload)
        book_index.write(site.dest)

        site.pages << book_index
      rescue Exception => e
        puts e
      end 
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
