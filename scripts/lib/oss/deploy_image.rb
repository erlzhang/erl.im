require_relative './deploy.rb'

class DeployImage < Deploy
  # 本地文件列表
  def local_objects
    files = []
    Find.find('img') { |path| files << path if File.file?(path) }
    files.compact
  end

  # 推送本地文件到远程
  def push_object(path)
    bucket.put_object(path, file: path)

    check_push_status(path)
  end
end
