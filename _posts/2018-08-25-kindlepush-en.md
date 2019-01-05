---
layout: post
title: Make Subscription to Daily News with Scrapy and Gitbook and Push it to Kindle
date: 2018-08-25 12:34:12 +0800
ref: kindlepush
locale: en
code: true
mermaid: true
excerpt: About four years ago, I used Gouerduo Daily Report for subscriptions to daily news for a period of time after I bought Kindle. I canceled it because of its uselessness. I found my isolation three months ago. However, about three months ago, I found my isolation and want to get more information about the outside world.
---
About four years ago, I used *Gouerduo Daily Report* for subscriptions to daily news for a period of time after I bought Kindle. I canceled it because I found it uselessness. However, about three months ago, I felt a little bit isolated and would like to get more information about the outside world.

I searched and compared with some productions for news subscription and finally choose *Kindle4rss*. I ordered it for one year.

I'm so careless to find that a lot of articles are incomplete until a month later. Some of them contain only the first page of the article. I mistook it for the invalid news from *CanKaoXiaoXi* for there is no hint of that. I also sent an email to *Kindle4rss* but there is no result. As a programmer, I decided to make it by myself.

**Principles:** Simple and easy to be developed. I should complete it within a week during my every-day lunch break.

The thread is simple:

```mermaid
graph LR;
  id1(fetch articles)-->id2(write them into an ebook);
  id2(write them into an ebook)-->id3(push to my Kindle);
```

I found some tools according to above:

```mermaid
graph LR;
  id1(Scrapy for the fetching of articles)-->id2(Gitbook for ebook);
  id2(Gitbook for ebook)-->id3(send an email to my Kindle);
```

## Fetching of Articles

I planned to fetch articles from the *World News* column only in the first version.

### Fetch

After parsing some pages of the column of *cankaoxiaoxi.com*, I found that the multipage is powered by `AJAX`. The site sends an asynchronous request to get a `json` file, in which the `json.data` is what we want.

```python
start_urls = ['http://app.cankaoxiaoxi.com/?app=shlist&controller=milzuixin&action=world&page=1&pagesize=20']
```

I want to deal with it simply. So just extract all links of the list.

```python
body = response.body[1:-1]
body = json.loads(body)
data = body["data"]
links = Selector(text=data).xpath("//a/@href").extract()
```

What I really want is the news published most recently. Outdated ones are useless. Fetch the first page and filter them by the published dates.

```python
date = datetime.datetime.strftime(datetime.datetime.now(), "%Y%m%d")

for link in links:
    if date not in link:
        return
    yield scrapy.Request(link, self.parse_article, dont_filter=False)
```

Get the links and put them in the fetching links stack. Then parse them with the `parse_article` method. There is a challenge here which caused the problems in the subscriptions of *Kindle4rss*. Some articles have more than one page. I also need to fetch the rest of the pages. Some of these pages belong to *Extra Readings* which are not useful for me and needed to be cut.

```python
def parse_article(self, response):
        item = KindleItem()
        item['resource'] = "参考消息国际版"

        # Parse the content.
        item['title'] = response.xpath("//h1[contains(@class, 'YH')]/text()").extract_first()
        item['content'] = response.xpath('//div[contains(@class, "article-content")]').extract_first()
        item['url'] = response.url

        # Drop the extra readings.
        if '延伸阅读' in item['content'] :
            return

        # Get the next page.
        next_link = response.xpath("//p[contains(@class, 'fz-16')]/strong/a/@href").extract_first()

        if( next_link ):
            yield scrapy.Request(next_link, self.parse_article, dont_filter=False)

        # Put them into the pipeline.
        yield item
```

### Pipeline

The items extracted will be put into pipelines for further processing. What we usually do is storing them in the database. However, we can just write them into `markdown` pages here to make an e-book according to the specification of the *Gitbook*. *What we get here is with the markup of `HTML`, which can be parsed correctly in a `markdown` file.*

```python
class KindlePipeline(object):
    def process_item(self, item, spider):
        date = datetime.datetime.strftime(datetime.datetime.now(), "%Y%m%d")

        d = sys.path[0] + "/posts/" + date + "/"

        # Extract the name of the file from the URL and cut the underline with integers in format '_1'. That will be the criteria of whether two pages belongs to one article.
        result = re.findall(r'(?<=\/)(\d+)(_\d+)?(?=.shtml)', item["url"])
        filename = result[0][0]

        # If there isn't any underline with integers, create a new file and write the contents into the file. The title and filename are also needed to be written into the file SUMMARY.md.
        if ( not result[0][1] or result[0][1] == "" ):
            f = open(d + filename + '.md', 'w')
            f.write('# ' + item["title"] + '\n\n')
            f.write(item["content"])
            f.close()
            summary = open(d + 'SUMMARY.md', 'a+')
            summary.write('* [' + item['title'] + '](' + filename + '.md)\n')
            summary.close()

        # Or just find the file with the extracted filename and append the contents.
        else:
            f = open(d + filename + '.md', 'a+')
            f.write(item["content"])
            f.close()
return
```
## Make an e-book

It can be done with only one line of command of *Gitbook*.

```sh
$ gitbook mobi ./ book.mobi
```

## Push to Kindle

Send an email with the attachment by `mutt` and `msmtp` to *Kindle*.

Then I need to integrate all those scripts in a `shell` file. The scripts will be executed every day with `crontab`.

```sh
#!/bin/bash

ls_date=`date +%Y%m%d`

cd posts
mkdir ${ls_date}
cd ${ls_date}
gitbook init

echo "{\"title\": \"kindle推送-${ls_date}\"}" >> book.json

cd ../..
/usr/local/bin/scrapy crawl ckxx

cd posts
cd ${ls_date}
gitbook mobi ./ ./../../ebooks/${ls_date}.mobi

cd ../..
echo "kindle推送-${ls_date}" | mutt -s "kindle推送-${ls_date}" icily0719@kindle.cn -a "ebooks/${ls_date}.mobi"
```

## Problem

There is no exception handling here. I'm too lazy to do that!

**Complete codes and files can be found here:** [kindlepush](https://github.com/erlzhang/kindlepush)
