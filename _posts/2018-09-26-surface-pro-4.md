---
title: 如何让SurfacePro4满足日常编程需求
date: '2018-09-26 09:43:44 +0800'
category: 折腾
keywords: Surface Pro 4, windows编程工具, Linux子系统, Ubuntu in windows10, Termius
description: 分享使用Surface Pro 4基于Windows10的Linux子系统编程的体验与常用工具。
---
电脑的选购理由有很多，有人追求性能，有人追求外观，有人追求便携性，也有人追求折衷。合理的电脑选购应当依据目标使用场景而定。

<!--more-->

在我的宏碁最终退役之前，我大概花了近两年的时间来选购新机——听起来有些夸张。主要是资金的局限，让我一直下定不了决心。

我的使用场景和选择因素：

- 使用场景主要是图像处理和文字处理；
- 我不打游戏，所以配置不用过高，流畅运行PS和AI即可，独显也很鸡肋；
- 便携性是必要的，有一段时间我甚至都不知道一个星期之后的自己会在哪里，一定要轻薄，方便携带；
- 外观是要有的。我不太喜欢苹果电脑的设计，到实体店逛了一圈后，最顺眼的是thinkpad X1
- 资金是一个很大的约束，6k-8k为宜。很不幸的，X1超预算了，不然我一定下手的。

最后选定的是SurfacePro4。经历了近两年的理性思考、调研和犹豫后，最终决定的还是直觉。我在上海的咖啡店倚着沙发听着音乐的时候，脑子一热就下单了。这也算不得冲动——我要求的，它都符合了。

当时欠考虑的只有一点——我没想到自己会真的踏入编程这行。于是在我的使用场景清单中，又要添加“写代码、调试程序”这一条。虽然现实证明我在办公室之外写代码的频率是非常低的，但毕竟是有的。怎么让surfacepro4 + win10完美实现我（偶尔的）的编程需求呢？

**解决方案：Linux in Windows10**

## 系统：[Ubuntu 18.04](https://www.microsoft.com/en-us/p/ubuntu-1804-lts/9n9tngvndl3q?activetab=pivot%3Aoverviewtab)

![ubuntu in windows](/img/surface/ubuntu_in_windows.png)

我的开发环境就是Linux。办公电脑是Ubuntu + Windows10双系统，但windows基本不用。我的SurfacePro是低配版，128G的SSD装双系统是不现实的。在微软没有搞出Linux子系统这个鬼东西之前，只能上虚拟机了，虚拟机太耗内存。子系统很好，消耗低，在windows下图形界面挺鸡肋的。就单纯开发而言，bash足够了。

运行速度和单纯的Linux系统相比还是慢了一些，毕竟是windows下的子系统。Rails应用启动服务和执行数据迁移都能感受到明显的延迟，就低频率的使用开发而言还是可以接受的，作为主力还是算了。

办公电脑Ubuntu14不能随便乱升，这里用一用高版本尝尝鲜。

## 编辑器：[Atom](https://atom.io/)

![Atom](/img/surface/atom.png)

工作中开发用编辑器就是vim，子系统一开始也是用vim，但子系统bash的高亮颜色实在是接受不了，改不成低饱和度的，反应也慢。还是改用windows的编辑器。先后用过Nodepad++和Sublime，都还好，除了一点：windows10下输入中文，输入法提示框跑到了编辑器左上角，两款编辑器都有这个问题，很奇怪。

最终选定了Atom：开源，功能应有尽有；还有堪称完美的markdown辅助功能，无论敲代码还是写文章都可胜任；UI风格也符合我的喜好。

目前唯一发现的问题：中英文混打的时候，有时候英文输入法切换不了中文。这应当不是输入法的问题，我在windows下和Ubuntu下测试都有这个问题。

## 远程终端：[Termius](http://www.termius.com/)

![Termius](/img/surface/termius.png)

前一阵子为了做Kindle电子报推送租了个服务器玩儿，需要一个远程终端管理。Ubuntu下用的是Remmina，windows下用过putty。但putty还未支持高清屏，界面有点发虚。

在win10商店里随便搜了一个Termius，试用了一下感觉还不错。功能上和其他终端管理大同小异，但是UI好看，颜色也终于不再是其他windows下终端那样的高饱和颜色，感觉很不错。

缺点：tmux自定义的快捷键用不了，不知道为什么。

## 文件传输：[FileZilla](https://filezilla-project.org/)

![FileZilla](/img/surface/filezilla.png)

最早接触虚拟主机的时候都是用FTP传输，商家只给一个ip、端口号和ftp登录名密码。但是众所周知，ftp不安全，很容易被攻击。ssh可以远程连终端，但是文件传输怎么办？有sftp呀！基于ssl的文件传输，很好。

无论ftp还是sftp，FileZilla都是最佳选择。有windows版和Linux版，功能强大，界面在高清屏下也不会失真。

## 项目管理：[Trello](https://trello.com/)

![Trello](/img/surface/trello.png)

Trello的大名早有耳闻，但我是在win10商店随便点出来玩儿一玩儿的，这一玩儿就上瘾了。项目管理、阅读管理、学习管理、写作管理、生活习惯管理、旅游计划管理乃至人生管理。只要是带上“计划”或“管理”这几个字的，估计没什么是它做不了的。它让我养成了哪怕开发一个小小的功能，也要做好计划做好排期的习惯。

## 补充总结

Surface适合日常使用和外出携带，linux子系统的出现为工作以外的开发提供了可行性，私下里做点小功能，或是外出时修复点bug还是可行的。但Surface Pro 4肯定是不能作为开发的主力机的，windows系统的开发环境天然带有局限性（至少对我来说是是如此），还是需要一台linux主机。
