---
title: Cookie、Token相关
category: 前端气宗专栏
date: 2023-08-20 22:44:04
tags:
---

cookie、token都是做鉴权验证的方式，实际上还应该有一个session，面试的时候总会问的一个问题：**cookie、session和token的区别**。实际上我认为这个问题很傻叉。因为本质上讲这三个东西就是一个东西，这种问题的逻辑，就相当于一只鸡从上下左右观察有什么区别。有鸡毛区别。

鉴权的两种方式：
### cookie+session
1. 用户登录，提交用户信息
2. 后端根据用户提交的数据生成一个sessionID，存储到磁盘，并通过set-cookie返回给前端
3. 前端收到自动存储到对应域名下的cookie中，之后的每次请求，都会自动带上这sessionID

### token
1. 用户登录，提交用户信息
2. 后段通过jwt等库提供的加密方式，生成一串字符串，无需存储，通过set-cookie返回给前端
3. 前端收到自动存储到对应域名下的cookie中，之后的每次请求，都会自动带上这token，后端只需要判断是不是他生成的即可

过程一致，唯一不同的，就是一个叫sessionID，一个叫token字符串，。这种问题，毫无意义。

