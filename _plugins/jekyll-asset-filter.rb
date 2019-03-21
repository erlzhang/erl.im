module Jekyll
  module AssetFilter
    require 'jekyll'
    require 'nokogiri'

    def asset_version(input)
      site = @context.registers[:site].config
      "#{input}?v=#{site["version"]}"
    end

    def ext(content)
      doc = Nokogiri::HTML.fragment(content)
      return content unless doc

      img_url = @context.registers[:site].config['img_prefix']

      doc.css('img').each do |img|
        original_url = img.get_attribute("src")
        next if original_url =~ /\Ahttp/i

        new_url = img_url + original_url
        img.set_attribute('src', new_url)
      end
      doc.to_s
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
