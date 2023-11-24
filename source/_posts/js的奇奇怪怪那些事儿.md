---
title: js的奇奇怪怪那些事儿
date: 2023-11-16 15:46:39
category: 大前端气宗专栏
---

 ### 本文主要是记录一些关于js的奇奇怪怪的特性，题目为主

1. 原型链
 ```javascript
function F() {}
Object.prototype.a = function() {
   console.log('a')
}
Function.prototype.b = function() {
  console.log('b')
}
const f = new F()
f.a()
f.b()
// 输出
// a
// Uncaught TypeError: f.b is not a function
 ```
解答：
- 因为f首先是一个对象，通过原型链找到a方法输出a
- 通过new方法出来的f，本质上是基于F构造函数的原型对象{}生成，所以无b方法

2. 变量提升 

```javascript
var name = 'World';
(function() {
  if (typeof name === 'undefined') {
    var name = 'Jack'
    console.log('Goodbay ' + name)
  } else {
    console.log('Hello ' + name)
  }
})()
// 输出结果：Goodbye Jack
```
js中var和function存在变量提升。

3. 异步
```javascript
async function async1() {
  console.log('A')
  await async2()
  console.log('B')
}
async function async2() {
  console.log('C')
}
console.log('D')
setTimeout(function() {
  console.log('E')
})
async1()
new Promise(function(resolve) {
  console.log('F')
}).then(function() {
  console.log('G')
})
console.log('H')
//输出顺序如下
//D
//A
//C
//F
//H
//B
//undefined
//E

```
注意：
- await后面的代码会被当成微任务塞入队列
- 并没有打印出`G`的原因在于，没有`resolve`

