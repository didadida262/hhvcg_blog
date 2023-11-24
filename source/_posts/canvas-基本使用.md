---
title: 'canvas: 基本使用'
date: 2023-11-23 19:17:53
category: 前端游戏杂谈
---
### 本文记录一些基本的图形绘制方法
<img src="/img/canvas基本绘制.png" alt="图片描述">

具体代码：
```javascript
      c.beginPath()
      c.arc(300, 200, 100, 0, 2 * Math.PI)
      const g = c.createLinearGradient(0, 0, 600, 400)
      g.addColorStop(0, 'green')
      g.addColorStop(1, 'red')
      c.fillStyle = g
      c.fill()
      c.stroke()
      c.closePath()
      
      c.beginPath()
      c.arc(250, 150, 20, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.arc(350, 150, 20, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.ellipse(300, 200, 10, 30, 0, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.moveTo(250, 300)
      c.lineTo(350, 300)
      c.stroke()
      c.closePath()
```

