---
title: canvas系列：windows泡泡屏保
date: 2023-11-22 20:27:23
category: 前端游戏杂谈
---

### 本文尝试用原生canvas实现windows的泡泡屏保效果，基于vue3框架
最终效果如下：
<img src="/img/steam.gif" alt="图片描述">

1. 首先html代码创建一个canvas画布
```html
  <div class="steam">
    <canvas width="360" height="520"></canvas>
  </div>
```

