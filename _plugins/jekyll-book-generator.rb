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

  class BookGenerator < Generator
    def generate(site)

      dir = "_books"

      books = []

      begin
        Dir.foreach(dir) do |book_dir|
          book_path = File.join(dir, book_dir)
          if File.directory?(book_path) and book_dir.chars.first != "."
            config_file = File.join(book_path, "config.json")
            config = File.read(config_file)
            book_config = JSON.parse(config)

            book = Hash.new

            book["title"] = book_config["title"]
            book["start"] = book_config["start"]
            book["end"] = book_config["end"]
            book["slug"] = book_dir

            books << book
          end
        end

        books.sort! { |x, y|
          x.end_date.to_i <=> y.end_date.to_i
        }

        book_index = IndexPage.new(site, site.source, "", books)
        book_index.render(site.layouts, site.site_payload)
        book_index.write(site.dest)

        site.pages << book_index
      rescue Exception => e
        puts e
      end 
    end
  end
end
