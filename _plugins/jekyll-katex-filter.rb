require 'execjs'

module Jekyll
  module KatexFilter
    def katex(html)
      is_latex = @context.registers[:page]["latex"]

      if is_latex
        site = @context.registers[:site].config
        katex_js_path = File.join(site["source"], "src/katex.min.js")

        katex_js = ExecJS.compile(File.open(katex_js_path).read)
        parsed_html = html.to_s.gsub(/(?<!\\)([$]{1})(.+?)(?<!\\)\1/) do |match|
          katex_js.call('katex.renderToString', Regexp.last_match(2), { displayMode: false })
        end
      else
        html
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::KatexFilter)
