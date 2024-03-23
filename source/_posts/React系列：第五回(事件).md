---
title: React系列：第五回(事件)
date: 2024-03-21 13:21:05
category: React系列
---

### 本文记录一下原生事件和react事件机制的差异

#### 一. 基本介绍
**原生dom事件：** 事件捕获 ---> 目标dom ---> 事件冒泡
**react事件系统：** 事件在具体的dom节点上触发后， 会被冒泡到document上，document上所绑定的统一事件处理程序，会讲事件分发到具体的组件实例中去。这一套机制被称为`合成事件`
`合成事件：` 模拟原生dom事件所拥有的能力, e.nativeEvent 获取原生事件对象

#### 二. 执行顺序

1. 原生事件优先执行，合成事件后执行。子元素原生事件执行、父元素原生事件执行、子元素合成事件执行、父元素合成事件执行、document原生事件执行。
2. 组织合成事件间的冒泡: `e.stopPropagation()`；阻止合成事件与最外层document上事件的冒泡： `e.nativeEvent.stopImmediatePropagation()`
