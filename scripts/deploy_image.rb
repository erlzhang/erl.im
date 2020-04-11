require 'yaml'

require_relative './lib/oss/deploy_image.rb'

Setting = YAML.load(File.open('./local.yml'))

DeployImages.new(Setting['oss']['id'], Setting['oss']['secret']).bulk_push_object
