---
title: Vue.js系列：vue的路由实现
date: 2023-08-11 00:45:40
category: 前端剑宗专栏
tags:
---

vue-router存在的目的，就是实现纯前端的路由跳转，需要满足两点：**无刷新、内容切换**
目下就是两种模式：**hash模式和history模式**

#### Hash模式：
#后面跟着路径（hash值），浏览器不会向后端发请求。因为#只是一个标识符。例如：http://www.xxx.com/#/info.html。
**实现原理：**
通过监听hashchange,获悉当前url，显示对应视图内容。
```javascript
window.addEventListener('hashchange', updateView)
```

#### history
h5新增的api，通过history.pushstate跳转到对应路由，显示对应视图,也能实现一样的功能，但是因为少个#，所以更加的美观.例如：http://www.xxx.com/info.html

但该方法准确的讲，是能够实现当用户没有刷新整个页面的情况下，实现视图的更新。如果强制刷新了页面，后端会收到该地址，若不处理，返回404，因为没有匹配到任何资源.因此这边需要后端做一个统一的处理，一般默认返回首页。
如果要细究vue-router的底层逻辑，实质还是一个类，具体实现还是响应式的那一套，区别在于，vue-router监听的是地址栏里的url，而MVVM监听的是页面数据，仅此而已。