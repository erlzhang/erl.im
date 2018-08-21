#!/bin/bash

cd _books
for book in `ls`
do
  cd $book
  head -n 4 book.json >> book.json.bak
  cat ../../book.conf.d >> book.json.bak
  echo "}" >> book.json.bak
  mv book.json.bak book.json
  gitbook install
  cd ..
done
