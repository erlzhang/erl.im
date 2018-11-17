---
layout: post
title: How to Program in Surface Pro 4?
date: 2018-09-26 09:43:44 +0800
locale: en
ref: surfacepro4
toc: true
---
Everyone has its own criteria to choose a new computer, like the performance, the outlooking, the portability or the compromise among those. It depends on how you use it.

<!--more-->

It may sounds crazy if I say I have spent nearly two years for searching for a new laptop before I drop the old Ancer. I have to compromise for my limit budget.

What do I think about when choose the laptop?

- I use it to beautify the pictures and type words mainly;
- It needn't to have high performance for I never play games with it. It is enough that it run AI and PS fluently.  And I need't Discrete Video card.
- It must be portable. There is period of time when I couldn't imagine where I would be the day after that day.
- It is better with aesthetic outlooking. I don't like the design of Mac. Thinkpad X1 is better.
- The price should be between 6k ~ 8k. Unfortunality the Thinkpad X1's price is beyond or I will get it.

I choose the Surface Pro 4 finally. Which made me make the decision is the instinct rather than ration when I was sitting in a sofa and listening to the music in the Zoo Cafe of Shanghai. However, that's not irrational for I have get what I want.

There is a lack of consideration, which is I couldn't predict that I would be a programmer one year later. I have to consider how to use it to program. In fact I hardly program at home. But I need to do conveniently if I have to. So how to program comfortably with Surface Pro and Windows10?

**The solution: Linux in Windows10**

## System: Ubuntu 18.04

![ubuntu in windows](/img/surface/ubuntu_in_windows.png)

I program in Linux most of the time. My laptop at work is a Thinkpad with both Ubuntu and Windows10. I hardly use latter. The Surface Pro I bought is with low specification. I can't install another system based on just 128 SSD. The only solution is visual system before the Subsystem and it use too much memory. I love the subsystem for the low cost of resources. GUI is uselesss where there is Windows. For programming, bash is enough.

The speed and effciency is lower than that in pure Linux. There is obvious delay when I start buiding and runing migration in Rails. It is ok to use it once in a while but not often.

I can't update the system of my work laptop casually, so I have a try of the version of 18.04 on Surface.

## Editor: Atom

![Atom](/img/surface/atom.png)

I use vim mostly at work, and so in subsystem at early stage. But I don't like the colors of the Bash, and I can't change them to ones with low saturation. And it runs slowly. So I switch to editors in Windows. I have used Nodepad++ and Sublime. Both of them are ok except for one thing. The input tooltip went to the left top corner of the screen when I typed in Chinese. It's strange.

I finally choose the Atom, which is open source and full of functions. I can type codes and write articles comfortably with it's nealy perfect Markdown Editor.

There is one limit ( and maybe bug ): Sometimes I can't switch to Chinese while typing in English. It is not the fault of the IME for I found that problem in both in Windows and Unbutu with Atom.

## The Remote Terminal: Termius

![Termius](/img/surface/termius.png)

I rent a VPS some months ago when I made the Kindlepush and need a remote terminal. I use Remmia in Ubuntu at work and putty in Windows. The UI of putty in my laptop is a little bit unclear for it havn'd been adapted to HD.

I found the Termius in the Microsoft Store and it hit my heart. The functions are same with other terminals but the UI is beautiful. There is none high saturation here.

The shortage: The shortcuts of I configured in Tmux doesn't work and I don't know why.

## File Transmittion: FileZilla

I used to use FTP for transmitting files into the server when I used Virtual Host early years. What the seller gave me are the IP, the port and the username and password of the FTP. It is unsafe to use ftp which is easily attacked. I can fetch my server with SSH, but what about file transmittion? The answer is SFTP, which is based on ssl and safe in transmitting.

FileZilla is the best choice both for FTP and SFTP. It can be used in Windows and Linux with full of functions.

## Project Management: Trello

![Trello](/img/surface/trello.png)

I found the Trello in Microsoft Store, but I have heard of it already. I found it very useful in project management, reading management, learning management, writing management, lifestyle management, travel management and even in life management. It can be used in anything which name contains  the word "management". I make a habit of making plans before any development with it.

## Conclusion

Surface is useful in daily use and outside use. Sometime you can use it to program outside work when make small project or repair a bug. However, it can not be use in your work. There is limits of programming in Windows, at least, for me. I need a Linux.