#!/bin/bash
read -p "Your book dirname: " dname

# 判断是否输入目录名
test -z $dname && echo "Dirname is needed" && exit 0

read -p "Your book title: " title

# 判断目录是否存在
test -e _books/${dname} && echo "Dir is already existed" && exit 0 

cd _books
mkdir ${dname}
cd ${dname}
gitbook init

start_year=`date +%Y`

echo "{" >> book.json
echo "\"title\": \"${title}\"," >> book.json
echo "\"start\": \"${start_year}\"," >> book.json
echo "\"end\": \"\"," >> book.json
cat ../../book.conf.d >> book.json
echo "}" >> book.json
gitbook install
