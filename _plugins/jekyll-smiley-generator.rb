module Jekyll
  class SmileyGenerator < Generator
    def generate(site)
      dir = "assets/smileys"
      smileys = {}

      begin
        Dir.foreach(dir) do |filename|
          if filename.chars.first != "." 
            basename = File.basename(filename, '.gif')
            name = basename.split("_").last
            smiley = {
              "name" => name,
              "img" => "/assets/smileys/#{filename}",
              "slug" => ":#{name}:"
            }
            smileys[name] = smiley
          end
        end
      rescue Exception => e
        puts e
      end
      site.config["smileys"] = smileys
    end
  end

  module SmileyFilter
    def smiley(message)
      site = @context.registers[:site].config

      smileys = site["smileys"]
      message.gsub!(/:([a-z]+):/) do |match|
        smiley = smileys[$1]
        if smiley
          "![#{$1}](#{smiley["img"]})"
        end
      end
      message
    end
  end
end

Liquid::Template.register_filter(Jekyll::SmileyFilter)
