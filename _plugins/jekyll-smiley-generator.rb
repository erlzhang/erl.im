module Jekyll
  class SmileyGenerator < Generator
    def generate(site)
      smiley_config = site.config["smiley"]
      return if not smiley_config or not smiley_config["enabled"]
      
      dir = smiley_config["dir"]

      smileys = {}

      begin
        Dir.foreach(dir) do |filename|
          if filename.chars.first != "." 
            basename = File.basename(filename, '.gif')
            name = basename.split("_").last
            smiley = {
              "name" => name,
              "img" => "/#{dir}/#{filename}",
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
