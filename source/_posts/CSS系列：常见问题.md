---
title: CSS系列：常见问题
date: 2023-11-20 15:22:04
category: Css专栏

---

### 本文用于记录常见css面试题

1. 前端响应式的策略？
- 媒体查询@media。根据设备的不同宽高数据，使用不同的样式代码
- 百分比
- vm、vh
- rem。

2. 水平垂直居中的手段？
- flex。
- grid(写法同flex一致)
- 绝对定位（两种）
- table
```css
    display：table-cell
    text-align: center
    vertical-align: middle
```

3. 两栏布局，右侧自适应？

- BFC
- calc(100% - 左侧宽度)
- margin-left: 左侧宽度
- flex: 1

4. 三栏布局，中间自适应？
- flex
- gird。grid-template-columns: 宽度 auto 宽度

5. css的选择器有哪些？他们的优先级？
important > 行内 > id > class > 元素标签选择器

6. 隐藏相关。
- dispaly: none
看不见摸不着
- visibility: hidden.
看不见摸得着。但无法响应事件。
- opacity： 0
看不见摸得着，可以响应事件。
- clip-path: 剪切路径。
```css
clip-path: polygon(点坐标....)
```
css3的能力加持，是我们能够仅仅用css就能裁剪出想要的图案。同时还能隐藏
看不见摸得着，无法响应事件

7. 如何处理单行/多行文本省略溢出？
- 单行文本：
```css
    overflow: hidden;
    text-overflow: ellipsis(溢出部分省略号)
    white-space: nowrap
```

- 多行文本
利用伪元素的content。
```css
/* 元素 */
position: relative
/* 伪元素 */
.main:after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0;
}
```

8. 画一个三角形？
```css
.main {
    width: 0;
    height: 0;
    border-width: 200px 200px 200px 200px;
    border-color: transparent transparent transparent red;
    border-style: solid
}
```
