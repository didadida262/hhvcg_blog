---
title: React系列：第六回(Fiber)
date: 2024-03-22 13:57:57
category: React系列
---

### 本文简单聊聊React的Fiber
<!-- 
react16之后，用fiber取代了stack reconciler，核心设计是增量渲染，将渲染工作分割为多区块，将其分散到多个帧中去执行。

1. `Stack Reconciler`

2. `Fiber Reconciler`




一. 官方团队通过fiber，对react底层的算法进行了重写
fiber节点， 实际上就是虚拟dom，用来描述真实dom的一种ast。





 `ReactDOM.createRoot开启异步渲染`
1. stack reconciler（栈调和）被fiber（纤程）取代
reconciler（diff）负责找不同，render负责渲染不同

2. 所谓`纤程`，是指比线程更加细小的单位

3. Fiber的核心： `可中断、可恢复与优先级`

4. react.render之后发生了啥

5. react的setstate之后， 发生了啥？
6. current树及workinprogress树
fiber结构的虚拟dom结构，说他是一个树结构，不如说是一个链表结构。通过child、return、sibling指向儿子、父亲和兄弟节点


**1. 初始化阶段**
输出fiber树

**2. render阶段**
找出界面中需要处理的更新

**3. commit阶段**
1. compelteWork： 负责处理fiber节点到dom节点的映射逻辑，人话就是，根据xunidom，生成真实dom
- 创建dom节点
- 将节点插入到dom树中
- 为dom节点设置属性
- appendAllChildren函数完成插入操作

创建好的dom节点元素会被复制到workInprogress节点的stateNode属性，子节点的插入，实际上就是插入到父节点的stateNode中
fiber树和dom树之间的关系？不就是同一个东西嘛？


**二. 事件切片和优先级**

1. `双缓冲模式`
两个舞台，无缝切换
`current树`和`workInprogres树`无缝切换

2. `时间切片`
通过schedule将long任务切片处理，以免任务阻塞渲染进程。


react的渲染流程

初始化挂载， setstate， diff + patch --> render-->
