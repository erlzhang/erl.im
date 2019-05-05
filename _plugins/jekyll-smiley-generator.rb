module Jekyll
  class SmileyGenerator < Generator
    def generate(site)
      dir = "assets/smileys"
      smileys = []

      begin
        Dir.foreach(dir) do |filename|
          puts filename
          if filename.chars.first != "." 
            basename = File.basename(filename, '.gif')
            name = basename.split("_").last
            smiley = {
              "name" => name,
              "img" => "/assets/smileys/#{filename}",
              "slug" => ":#{name}:"
            }
            smileys << smiley
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
      message
    end
  end
end

Liquid::Template.register_filter(Jekyll::SmileyFilter)
