# Weixin-AppleMusic-Copy
### 介绍 Introduction

Apple Music 苹果音乐的微信小程序仿版，资源问题不支持实际的音乐播放。

本项目的目的是基于微信小程序，模仿现有的Apple Music音乐的安卓平台的设计。考虑到苹果官方的商用API是付费订阅使用，且价格不菲，项目选择了其他的接口做了功能性平替。

部分动态数据和搜索服务依赖last.fm的API运行。

剩余部分数据last.fm无法提供，考虑到项目性质为训练项目，选择在腾讯云的学生云服务器上使用nginx+FastAPI配置了一个静态资源+API的综合服务器，FastAPI运行在服务器的5000端口，由于小程序关闭域名校验后可使用http协议，此处不做https协议域名配置。



A copy of Apple Music by wx-app, which is not official, and lack of music resources.

The purpose of this project is to mimic the design of the existing Apple Music music for Android platform based on WeChat applets. Considering that Apple's official commercial API is a paid subscription to use and expensive, the project chose other interfaces to do a functional levelling.

Part of the dynamic data and search services rely on the last.fm API to run.

The remaining part of the data last.fm can not provide, taking into account the nature of the project for the training project, chose to use the Tencent cloud student cloud server nginx + FastAPI configuration of a static resource + API integrated server, FastAPI running on the server port 5000, due to the applet to close the domain name checks can be used after the http protocol, there is no https protocol domain name configuration.



### 示例图片  Example Image

[Weixin-AppleMusic-Copy/images/image25.jpeg at main · MadestSamurai/Weixin-AppleMusic-Copy (github.com)](https://github.com/MadestSamurai/Weixin-AppleMusic-Copy/blob/main/images/image25.jpeg)

[Weixin-AppleMusic-Copy/images/image28.png at main · MadestSamurai/Weixin-AppleMusic-Copy (github.com)](https://github.com/MadestSamurai/Weixin-AppleMusic-Copy/blob/main/images/image28.png)

