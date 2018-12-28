#!/bin/bash

bundle exec jekyll build --incremental

uglifycss _site/assets/main.css > _site/assets/style.css
mv _site/assets/style.css _site/assets/main.css
