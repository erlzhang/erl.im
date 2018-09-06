#!/bin/bash

npm run build

bundle exec jekyll build

uglifycss _site/assets/main.css > _site/assets/style.css
mv _site/assets/style.css _site/assets/main.css
