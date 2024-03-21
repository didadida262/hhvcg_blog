---
title: React系列：数据的流动
date: 2024-03-14 20:02:29
category: React系列
---

### 本文我们简单聊聊React中，数据的流动




1. 父组件任何状态更新触发的渲染，都会导致子组件重新渲染。为此，可以通过shouldComponentUpdate或者useCallback处理
react15的生命周期类似vue，16大改。

<img src="/img/react15+16生命周期.png" alt="">
<img src="/img/react15+16生命周期.png" alt="">
在react16中，基于fiber架构，将同步渲染改成了异步渲染，因此将上述桑生命周期给废弃，因为可能会出现多次重复的渲染








