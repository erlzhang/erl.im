#!/bin/bash
read -p "dirname:" dname

# 判断是否输入目录名
test -z $dname && echo "Dirname is needed" && exit 0

# 判断目录是否存在
test -e _books/${dname} && echo "Dir is already existed" && exit 0 

cd _books
mkdir ${dname}
cd ${dname}
gitbook init

start_year=`date +%Y`

echo "{" >> config.json
echo "\"title\": \"\"," >> config.json
echo "\"start\": \"${start_year}\"," >> config.json
echo "\"plugins\": [\"-lunr\", \"-search\", \"-sharing\"]," >> config.json
echo "\""links\" : { \"sidebar\" : { \"Home\" : \"http://yexiqingxi.com\" } } >> config.json
echo "}" >> config.json
