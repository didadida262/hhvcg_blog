---
title: React系列：诡异的点
date: 2024-03-15 00:21:20
category: React系列

---

### 本文重点罗列一些react中，令人诡异的点

1. **setstate改变值后，打印出来的，居然还是旧的值**
看如下代码：
```javascript
const AboutComponent = () => {
  const [count, setcount] = useState(0)
  const handleClick = (type) => {
    setcount(count + 1)
    console.log('count>>', count)
  }

  return (
    <div>
      <span>{count}</span>
      <Button onClick={handleClick}>React点击</Button>
    </div>
  )
}
```
点击按钮变更count， 打印出来的count的值: count>> 0
**...写了两三年vue的我表示：what？**
解释： `react中，状态的更新是异步的，setcount的调用是同步的，所以打印出来的count的值，还是0`
这是react的一个特性，也是react的坑。那么为什么要设计出这种坑呢？`避免多次render`。可以将setstate这种操作看成是异步的，比如通过setstate改变了某个状态，但是这个改变的任务，会被塞入一个异步队列中，然后继续执行后面的代码，当所有代码执行完毕之后，再从队列中批量执行更新的操作，最后render页面。

那么现在我有个强烈的需求，我就是要在更新完state之后，获取最新的值，怎么破？
1. 函数式组件中，可以给setstate一个回调作为其第二个参数，在回调中可以获取更新之后的值
2. 函数式组件中，最直接的方式，就是以更新后的值作为参数，传给一个函数，然后再函数中执行逻辑代码，简单粗暴。
3. 官方建议的方式，setstate给一个函数作为参数，如下面的方式：
```javascript
    setcount((prev) => {
      const res = prev + 1
      console.log('res', res)
      return res
    })
```

