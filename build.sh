#!/bin/bash

jekyll build

test ! -e _site && exit 0

cd _books
for book in `ls`
do
  cd $book
  gitbook build
  cd ../../_site
  test -e $book && rm -r $book
  mkdir $book
  cd ..
  cp -r _books/$book/_book/.  _site/$book
  cd _books
done
