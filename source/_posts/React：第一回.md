---
title: 'React: 第一回'
date: 2023-10-24 23:13:23
category: React系列
---

自本文开始，我们将逐步介绍react的必要概念，以备忘录。

### react带来了利？
- 1. 组件化开发，声明式编码，提高开发效率及组建复用率。
- 2. react-native中，使用js开发移动端应用
- 3. 虚拟dom+优秀的diffing算法，尽量减少与真实dom的交互

### 基本介绍

1. 基础原理
React仅仅是一个UI库。官方对`React`的定义为：
> 用于构建用户界面的 JavaScript 库。
其根基思想就是 `数据驱动视图`

2. jsx 语法
```javascript
const Example = () => {
  return (
    <div>
      Hello {props.name}
    </div>
  );
}
```
`HTML 中夹杂着看似 JavaScript 的语句在其中`,称之为jsx语法，它是对 JavaScript 语法的扩展。jsx 看起来有点像模板语言，但是他又具有 JavaScript 的全部功能。

类似于vue中的v-if条件渲染，jsx 中的写法如下：
```javascript
const Example = () => {
    // 条件判断，随机显示男女
    const greater = Math.random() * 10 > 5;
  return (
    {greater > 5 ? (
      <div style={{ color: 'green' }}>我是男生</div>
    ) : (
      <div style={{ color: 'red' }}>我是女生</div>
    )}
  );
}
```
3. React 组件
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
// 定义 App 组件 props 的类型
type Props = {
  name?: string;
}
// 定义一个叫App 的组件
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name || '未知名字'}
      </h1>
    </div>
  );
}
// 找到组件将要渲染的 html tag 位置（使一个 id ="root" 的标签）
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/*大家关注下面的一行，渲染上面写的组件App */}
    <App name={"xx"} />
  </React.StrictMode>
);

export default App;
```
上面的代码中，我们写了一盒函数组件，搭配ts定义了该组件的Props类型。

react中的组件有两种方式：`函数组件和类组件`，目前公司业务普遍选择前者。

几个函数组件的错误案例：
```javascript

type Props = { // 不了解ts的话，可以忽略下面的Props
  name?: string;
}
// 变量声明写在了return中
function App(props: Props) {
  return (
    const tmp = '123';
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
}
// 函数写在了return中
function App(props: Props) {
  return (
    function tmp() {};
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
}
// 同1
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
  // 这个跟其他语言一样，return 之后不会执行
  const a = 123;
}
```

更进一步的看个样例，让页面交互起来：
```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

type Props = {
  name?: string;
}
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name || '未知名字'}
      </h1>
    </div>
  );
}
type CounterProps = {
  start?: number;
}
const Counter = (props: CounterProps) => {
  // 设置内部状态的初始值，初始值是外部传进来的，当然，如果不传，那就使用默认值 0
  const [count, setCount] = useState(props.start || 0);
  const plus = () => {
    // 更新数据
    setCount(count + 1);
  }
  // return 返回的就是 UI，也是所见即所得，你看到的 dom 结构就是页面渲染后看到内容
  return (
    <div style={{ textAlign: 'center' }}>
      Count: {count}
      <button onClick={plus}>点我加1</button>
    </div>
  );
}
// 找到组件将要渲染的 html tag 位置（使一个 id ="root" 的标签）
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/*大家关注下面的一行，渲染上面写的组件 */}
    <App name={"xx"} />
    <Counter start={10} />
  </React.StrictMode>
);

export default App;
```
实际就是一个计数器，点击++。但我们引入了新的内容 **useState**，说白了就是组件内部有了状态变量。useState就是所谓的 是 react hooks 中的一种。
根据有无状态，组件可以分为两种：**简单组件（simple component） 和 有状态组件（stateful component）。**

4. Hook
```javascript
import React, { useState } from 'react';
function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

在这里，useState 就是一个 Hook （通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。useState 会返回一对值：**当前状态和一个让你更新它的函数**，你可以在事件处理函数中或其他一些地方调用这个函数。你可以简单把它理解成调用这个函数会更新 state 的状态，然后这组件重新渲染。（使用 State Hook里展示了一个对比 useState 和 this.state 的例子）。
useState 唯一的参数就是初始 state。在上面的例子中，我们的计数器是从零开始的，所以初始 state 就是 0。值得注意的是，这里的 state 不一定要是一个对象，可以是任意值。这个初始 state 参数只有在第一次渲染时会被用到。

你可以在一个组件中多次使用 State Hook:
```javascript
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [name, setName] = useState('chaochao');
  const [friends, setFriends] = useState([{ name: 'lulu' }]);
  // ...
}
```

再来看一下另一个hook：**useEffect**
这个 hook 的核心作用就是在组件渲染完毕之后，你想做点别的事情（我们统一把这些别的事情称为“副作用”）。
比如你想渲染完之后立即进行数据获取、事件订阅或者手动修改过 DOM，这些都是副作用，都可以在 useEffect 中执行。
useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount(组件第一次渲染结束后触发)、componentDidUpdate（组件每次更新结束后触发） 和 componentWillUnmount（组件将要卸载的时候触发） 具有相同的用途，只不过被合并成了一个 API（链接：使用 Effect Hook里展示了 useEffect 和 clss 组件中这些生命周期的对比例子）。
即 useEffect 可以根据参数的不同配置，在组件不同的渲染时机被调用。useEffect 接受两个参数：
1. 副作用函数
2. 依赖项，类型是数组
```javascript
// 依赖项是空数组，第一次渲染结束后，调用一次
useEffect(() => {
    ...
},[]);

// 依赖项有值（不论个数），组件第一次渲染结束后，调用一次。后面检测到依赖发生变化的时候，自动调用，每变一次调用一次
useEffect(() => {
    ...
},[依赖1,依赖2]);

// 没有填依赖项，则组件每次渲染结束后，都调用一次，不限次数
useEffect(() => {
    ...
});
```
**你可以在组件中多次使用 useEffect，每个 effect 关注自己的事情即可。**
```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  // 一个组件中可以使用多个useEffect,
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    // 这里假设有个 ChatAPI 的服务
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
```
当然，除了上面上面的几个 hook，开发中常用的 hook 还有其他的，如 useContext、useReducer、useCallback、useMemo等，文本就不在挨个展开，大家可以自行学习了解。
需要注意的是，不管是什么样的 hook，react 规定我们必须把 hooks 写在函数的最外层，不能写在 ifelse 等条件语句当中，来确保 hooks 的执行顺序一致。

注： 本文大量参考平台内部某同学的文章，请留意。
**文毕**