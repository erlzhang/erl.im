#!/bin/bash

jekyll build

cd _books
for book in `ls`
do
  cd ${book}
  gitbook build
  cd ../../_site
  rm -r ${book}
  mkdir ${book}
  cd ..
  cp -r _books/${book}/_book/. _site/${book}
  cd _books
done
