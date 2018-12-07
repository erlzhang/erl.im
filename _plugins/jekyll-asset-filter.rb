module Jekyll
  module AssetFilter
    def asset_version(input)
      site = @context.registers[:site].config
      "#{input}?v=#{site["version"]}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
