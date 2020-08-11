require 'json'
require 'yaml'

class LoveBook
  attr_reader :book_dir, :output_dir, :book_name, :title, :author

  def initialize(book_dir, output_dir)
    @book_dir = book_dir
    @book_name = File.basename(book_dir)
    @output_dir = output_dir || Dir.pwd
    set_book_title
    set_book_author
  end

  def exec
    file_touch_book
    file_rename_index_to_README
    system("gitbook mobi #{book_dir} #{output_path}")
    file_rename_README_to_index
    file_rm_book
    puts_information
  end

  def config
    @config ||= YAML.load(File.open('_config.yml'))
  end

  private

  def puts_information
    # puts "#{color_green} LoveBook -- book_dir:  #{book_dir}"
    # puts "#{color_green} LoveBook -- book_name: #{book_name}"
    puts "#{color_green} LoveBook -- title:  #{title}"
    puts "#{color_green} LoveBook -- author: #{author}"
    puts "#{color_green} LoveBook -- output: #{output_path}"
    puts "#{color_green} LoveBook -- 乖宝宝，爱你哟~"
  end

  def output_path
    File.join(output_dir, "#{book_name}.mobi")
  end

  def set_book_title
    File.open(file_index_path) do |file|
      while line = file.gets
        if line =~ /title/
          @title = line.split(':').last.strip
          break
        end
      end
    end
  end

  def set_book_author
    @author = config['author'] || config['title'] || '佚名'
  end

  def file_index_path
    File.join(book_dir, 'index.md')
  end

  def file_README_path
    File.join(book_dir, 'README.md')
  end

  def file_book_path
    File.join(book_dir, 'book.json')
  end

  def file_touch_book
    File.open(file_book_path, 'w') do |file|
      file.write({
        title: title,
        author: author
      }.to_json)
    end
  end

  def file_rm_book
    File.delete(file_book_path)
  end

  def file_rename_index_to_README
    File.rename(file_index_path, file_README_path)
  end

  def file_rename_README_to_index
    File.rename(file_README_path, file_index_path)
  end

  def color_green
    "\033[0;32m"
  end
end

LoveBook.new(ARGV[0], ARGV[1]).exec

