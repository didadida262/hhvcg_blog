---
title: 玩具Reactjs系列：第二回(concurrentmode、fiber)
date: 2024-04-23 00:18:07
category: 前端剑宗专栏
---

### 本文介绍，react快速渲染的原理

在第一回中，我们通过手撕`myCreateElement`和`myRender`实现了基本的功能，但是仔细观察下之前写的render，是否存在什么问题？

```javascript
    const myRender = (element, container) => {
      const dom = element.type === 'text'? document.createTextNode(element.props.nodeValue): document.createElement(element.type)
      Object.keys(element.props).filter((item) => item !== 'children').forEach((item) => dom[item] = element.props[item])
      element?.props?.children?.forEach((child) => myRender(child, dom))
      container.appendChild(dom)
    }
```

render做的事情很清晰，就是**根据elemnt的信息，生成真实的dom然后挂载**，对于其中的子节点，我们只是粗暴的递归之。设想一下，如果我们传入的是一个巨深的虚拟dom，那么会发生什么？render这个函数的耗时势必也会剧增。即：从首次执行render开始到最终结束，期间的浏览器都是处于阻塞的状态。此时是无法响应任何用户的操作的。俗称`卡死`。

那么react底层是如何做优化的呢？答案也很清晰，利用一个api：`requestIdleCallback`.

### 1. requestIdleCallback
该函数的作用，就是能够观察浏览器在处理完每帧的工作之后，是否存在空余时间。如果有，就执行requestIdleCallback的回调，没有，则忽略。

因此，react能够做到快速的底层思路就有了：**把render的操作变成一个个的任务单元。这些任务单元执行的前提条件是：当前帧存在空余时间，有则执行，没有下一帧继续判断执行。**
既然提到了`requestIdleCallback`,那就不得不再提一下另一个api：`requestAnimationFrame`。这个api我们之前将屏幕刷新率的时候也提到过。那么两者有什么区别呢？
两者都会在每一帧执行注册任务，本质区别在于优先级：raf注册的任务属于高优先级，尽力保证每一帧都会执行一次。而requestIdleCallback注册的任务则属于低优先级，只有当前帧存在剩余时间才会执行，有可能永远不执行。

测试优先级：
```javascript
    const workLoop2 = () => {
      console.log('requestIdleCallback')
      requestIdleCallback(workLoop2)
    }
    requestIdleCallback(workLoop2)
    const workLoop1 = () => {
      console.log('requestAnimationFrame')
      requestAnimationFrame(workLoop1)
    }
    requestAnimationFrame(workLoop1)
```
效果如下：

<img src="/img/玩具react系列2_1.gif" alt="">

从实测效果来看，即使`raf`代码后执行，注册的任务优先级仍然高于`requestIdleCallback`,甚至还出现了raf执行了四次之后才执行了一次requestIdleCallback.

### 2. 具体实现


<!-- 流程： -->