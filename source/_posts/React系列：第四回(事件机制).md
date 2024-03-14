---
title: React系列：事件机制
date: 2024-03-14 20:02:29
category: React系列

---

### 本文我们简单聊聊React的事件机制

### 事件绑定

React的事件绑定和DOM元素的事件绑定一样，都是通过on开头的事件属性来绑定事件，那么两者有啥区别？。

1. **书写方面稍有不同**
```javascript
      <Button onClick={handleClick}>React点击</Button>
      <button onclick="handleClick()">原生点击</button>
```

2. **执行顺序**
