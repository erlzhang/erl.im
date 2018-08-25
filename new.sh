#!/bin/bash
read -p "Your book dirname: " dname

# 判断是否输入目录名
test -z $dname && echo "Dirname is needed" && exit 0

# 判断目录是否存在
test -e _books/${dname} && echo "Dir is already existed" && exit 0

read -p "Your book title: " title

cd _books
mkdir ${dname}
cd ${dname}

# 判断是否有书籍名
test -z $title && echo "# $title" > index.md || touch index.md

echo "* [$title](index.md)" > SUMMARY.md

echo "{" >> book.json
echo "\"title\": \"${title}\"," >> book.json
echo "\"start\": \"\"," >> book.json
echo "\"end\": \"\"" >> book.json
echo "}" >> book.json
