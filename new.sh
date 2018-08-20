#!/bin/bash
echo "Please enter your book's dir name:"
read dname
echo "And the title:"
read title
echo "When you start this book?(please enter the year)"
read start_year
echo "And the end year?"
read end_year

cd _books
mkdir ${dname}
cd ${dname}
gitbook init

echo "{" >> config.json
echo "\"title\": \"${dname}\"," >> config.json
echo "\"start\": \"${start_year}\"," >> config.json
echo "\"end\": \"${end_year}\"," >> config.json
echo "\"plugins\": [\"-lunr\", \"-search\", \"-sharing\"]," >> config.json
echo "\""links\" : { \"sidebar\" : { \"Home\" : \"http://yexiqingxi.com\" } } >> config.json
echo "}" >> config.json
