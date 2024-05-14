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

render做的事情很清晰，就是**根据element的信息，生成真实的dom然后挂载**，对于其中的子节点，我们只是粗暴的递归之。设想一下，如果我们传入的是一个巨深的虚拟dom，那么会发生什么？render这个函数的耗时势必也会剧增,`一旦开始执行，就会执行到底`。即：从首次执行render开始到最终结束，期间的浏览器都是处于阻塞的状态。此时是无法响应任何用户的操作的。俗称`卡死`。

那么react底层是如何做优化的呢？答案也很清晰，利用一个api：`requestIdleCallback`.

### 一. requestIdleCallback
该函数的作用，就是能够观察浏览器在处理完每帧的工作之后，是否存在空余时间。如果有，就执行requestIdleCallback的回调，没有，则忽略。

因此，react能够做到快速的底层思路就有了：**把render的操作变成一个个的任务单元。**这些任务单元执行的前提条件是：**当前帧存在空余时间，有则执行，没有下一帧继续判断执行。**
既然提到了`requestIdleCallback`,那就不得不再提一下另一个api：`requestAnimationFrame`。这个api我们之前讲屏幕刷新率的时候也提到过。那么两者有什么区别呢？
两者都会在每一帧执行注册任务，本质区别在于优先级：`raf注册的任务属于高优先级，尽力保证每一帧都会执行一次。而requestIdleCallback注册的任务则属于低优先级，只有当前帧存在剩余时间才会执行，有可能永远不执行。`

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

顺便提一下的这俩的一个细节：`dealine参数`

```javascript
    const workLoop2 = (deadline) => {
      console.log('requestIdleCallback')
      console.log('requestIdleCallback-deadline>>2', deadline)
      console.log('requestIdleCallback-deadline>>2-----', deadline.timeRemaining())

      requestIdleCallback(workLoop2)
    }
    requestIdleCallback(workLoop2)
    const workLoop1 = (deadline) => {
      console.log('requestAnimationFrame')
      console.log('requestAnimationFrame-deadline>>1', deadline)

      requestAnimationFrame(workLoop1)
    }
    requestAnimationFrame(workLoop1)
```

打印如下：
<img src="/img/玩具react系列2_2.jpeg" alt="">

**dealine用来提供额外的时间信息, 其中requestIdleCallback的deadline存在一个timeRemaining方法当前帧剩余时间**
react的底层并未通过`timeRemaining`获取剩余时间，而是自创了一套`schedule`

### 二. 具体实现
流程：
<img src="/img/玩具react2_3.png" alt="">

根本思路: **借助requestIdleCallback，将之前render的这个大的任务打碎，然后见缝插针式的执行**

#### 2.1 fiber
fiber也是一种数据结构，类似vnode
在vue中，vnode --> 真实dom
在react中， vnode（ReactElement） --> fiber ---> 真实dom

### 2.2 代码
完整代码如下：

```javascript

let nextUniteWork = null
const performUniteOfWork = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
    console.log('fiber>>>',fiber)
    console.log('fiber.dom>>>',fiber.dom)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  const elements = fiber?.props?.children
  console.log('elements>>', elements)
  let preSibling = null
  elements?.forEach((childElement, index) => {
    const newFiber = {
      parent: fiber,
      props: childElement.props,
      type: childElement.type,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      preSibling.sibling = newFiber
    }
    preSibling = newFiber
  });
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

}
const workLoop = (deadline) => {
  let shouldYield = true
  console.warn('执行>>>loop')
  while (nextUniteWork && shouldYield) {
    console.log('执行>>>任务')
    nextUniteWork = performUniteOfWork(nextUniteWork)
    shouldYield = deadline.timeRemaining() > 100
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

const myRender = (element, container) => {
  console.log('element>>', element)
  nextUniteWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

```



