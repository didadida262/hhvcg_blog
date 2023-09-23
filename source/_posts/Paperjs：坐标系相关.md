---
title: Paperjs：坐标系相关
date: 2023-09-22 15:43:18
category: Paperjs专栏
---

### 本文将详细介绍paperjs坐标相关的点

在paperjs的坐标体系中，默认方向为`右正下正`，没记错的话，应该是同opencv一致。我们通常见到的右正上正的坐标系，是标准的`笛卡尔坐标系`。这是一点区别。
那么如果现在我们要做一件事情，**就是将paperjs的坐标系转换成标准笛卡尔坐标系，该如何实现呢？即使实现，对原本的那些事件点击的操作有什么影响呢**

### 1. 首先我们老样子初始化那一套，然后把标准的缩放拖拽操作`随意`的加上，同时`随意`的加上图片、文本等：
<img src="/img/paperjs坐标1.png" alt="">

从坐标数据能够看出，这确实是标准的`右正下正`结构。

### 2. 在1的基础之上，我们借助matrix，将坐标系变更为标准的笛卡尔坐标系。
`关键代码`:
```javascript
    this.project.view.matrix = new paper.Matrix().scale(1, -1)
```
结果如下：
<img src="/img/paperjs坐标2.png" alt="">

**前后对比，发现了啥？**坐标系翻转后，坐标确实变成了标准笛卡尔坐标系，右正上正但是，发现了新的问题：
- project视图的zoom没了，直接导致缩放挂掉
- 图片文字这样的内容，被镜像翻转

#### zoom为0怎么处理？
查看view发现如下：
<img src="/img/paperjs坐标3.png" alt="">
确实应用matrix后zoom变成了0，且始终为0。所以，缩放的逻辑就不能再用zoom。那改用谁呢？还是`Matrix`

```javascript
export const setProjectZoom = (pro, zoom) => {
  const currentZoom = pro.view.matrix.a
  const matrix1 = new paper.Matrix().scale(1 / currentZoom, 1 / currentZoom)
  const matrix2 = new paper.Matrix().scale(zoom, zoom)
  pro.view.transform(matrix1)
  pro.view.transform(matrix2)
}
```
**先归一，后赋值期望的zoom**

### 文本图片内容发生了镜像变化，如何处理？
- 针对文本。
```javascript
export const modifyDirection = (path: any) => {
  path.rotate(180)
  path.scaling = new paper.Point(-1, 1)
}
```

- 针对图片。图片跟文本一样，完全y方向上倒了过来。
首先尝试复用针对文本的处理，但是发现不行，图像会无端变成原本大小。我们呢需要做的操作很清晰：绕着自身旋转180，然后再取以自身的镜像。
**具体操作，待续....**





