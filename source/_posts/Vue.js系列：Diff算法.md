---
title: Vue.js系列：Diff算法
date: 2023-09-06 00:48:13
category: 大前端剑宗专栏
---

### 本文尝试尽可能详细的介绍Diff算法的核心原理
#### 首先我们要知道,diff用来干嘛的？
更新页面的策略有两种
- 其一：频繁操作dom
- 其二：将页面的所有节点，转化成AST，又称为虚拟dom表示，本质就是js的对象。然后通过一些算法，找出前后两者的差异，更新差异之后，再还原成真实的dom节点render。
区别在于： 第一种，改数据，render，改数据，render....第二种，改数据，改数据，改数据，改数据，改数据，render。

代码举例验证一个事实：频繁的操作数据，远快于频繁的操作dom，因为后者会增加一个额外的开销：**渲染**
```javascript
// 第一组
<script>
    const div = document.getElementById('123')
    console.time('1')
    for (let i = 0; i < 100000; i++) {
        div.innerHTML = i
    }
    console.timeEnd('1')
</script>
// 耗时：1: 126.406005859375 ms
// 第二组
<script>
    const div = document.getElementById('123')
    console.time('1')
    let content = 0
    for (let i = 0; i < 100000; i++) {
        content = i
    }
    div.innerHTML = content
    console.timeEnd('1')
</script>
// 耗时: 1: 0.6298828125 ms
```
性能比对，立竿见影。
**基于上面小实验的结论，我们知道了为啥要用diff算法，下面，我们就深入的聊聊。**

1. **虚拟DOM**。DOM元素有元素节点（div）、文本节点（text）、注释节点等。vnode实际上就是这些节点的ADT（抽象数据类型）。
举例解释：
```javascript
<p>asdasdasd</p>
const vnode = {
  tag: 'p',
  data: {...} // 比如class、style等
  children: [...], // 儿子节点
  ....
}

// 注释节点
{
  text: '注释节点',
  isComment: true
}


// 文本节点
{
  text: '一段文本'
}
...
...
```
vnode就是一个类，这个类拥有比如tag、text、children等属性来描述实例化的vnode。仅此而已。
至此我们明白了虚拟DOM和真实DOM之间的映射关系，完成了第一步.

2. **节点的patch（补丁）操作，是虚拟dom更新核心中的核心。**对比新旧节点的过程，本质上来讲就三种情况：创建节点、删除节点和修改需要更新的节点。
   
**1.创建节点，两种情况**
1.1 当oldVnode中不存在但是vnode中存在的某些节点时，需要创建新节点
1.2 当新旧节点是完全不同的节点时，比如新节点时一个text，但是旧节点是一个div。此时需要删除旧的创建新的

**2.删除节点：上面提了不赘述**

**3.当两个节点是同一节点的时候，才需要更新节点**
3.1 首先判断新旧节点是否为如下所示的静态节点：
```javascript
<p>asdasdasd</p>
```
所谓的静态节点就是不存在状态的标签节点。此时，直接跳过，因为他不会变化。
3.2 新节点是否为文本节点
3.2.1 新节点是文本节点： 旧节点有children删children，有text覆盖更新
3.2.2 新节点是元素节点
3.2.2.1 新节点有children
3.2.2.1.1 旧节点无children：遍历新节点children挨个添加
3.2.2.1.2 旧节点有children： **diff算法**
3.2.2.2 新节点无children： 旧节点有text删text，有children删children

3. **diff正文**
当新旧节点满足上面3.2.2.1.2时，才会走diff比对更新。怎么实现的？**双指针 + 递归**
毫无疑问我们需要遍历。遍历新节点的children，挨个去旧节点的children中去找，如果没找到，说明该节点是由于状态变化新增的节点，那就要创建。如果找到了那就更新。当然还有一个可能，就是找是找到了，但是位置变了，这时，就需要移动该节点的位置。目的，就是为了尽可能地。复用旧节点



















新旧虚拟dom对比过程
1. 判断是否为同一个元素。不是，暴力删除


vue2: 递归 + 双指针
新前旧前、新后旧后、新后旧前、新前旧后







这里还需要说的一点是，不是说有了diff性能一定就是好的。试想一下一个静态页面。需要用得着diff吗？
