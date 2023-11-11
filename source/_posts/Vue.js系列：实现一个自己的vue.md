---
title: Vue.js系列：实现一个自己的vue
date: 2023-08-09 09:54:37
category: 大前端剑宗专栏
tags:
---

**本文开始，我们尝试着实现一个自个儿的vue框架（简陋版本）。**

1. 首先我们的页面结构如下：
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My_vue</title>
</head>
<script src="./Compile.js"></script>
<script src="./Myvue.js"></script>
<body>
    <div id="app">
        <input type="text" v-model="msg">
        <div>{{msg}}---{{info}}</div>
    </div>
</body>
<script>
    const mv = new MyVue({
        el: '#app',
        data: {
            msg: 'hello',
            info: 'world'
        }
    })

</script>
</html>
```
照葫芦画瓢，通过script标签引入我们的Myvue文件，然后在底部实例化mv。入参的名称参考vue。
样子有了，具体页面呢？
具体页面长这样：
<img src="/img/vue_basic_1.jpg" alt="主页面结构" width="500">

其中输入框通过v-model绑定变量msg，另一个文本绑定了info。可为什么原样显示呢？废话，应为我们还啥都没做。目前的Myvue代码如下：
```javascript
class MyVue {
    constructor(vm) {
        this.vm = vm
        this.$data = vm.data
        this.$el = document.querySelector(vm.el)
        new Compile(this)
    }
}
```
Myvue就是一个class类，其中拥有三个属性，vm，当前myvue的实例，更直白的将就是描述当前组件的那个入参对象；$data: 设置的各个变量；$el: 绑定的div的dom节点。
vue框架的做的第一件事情，就是页面渲染完成后，能够将其中的变量msg和info变成我们设置的值，而不是上面那副模样。这个过程，就是**模板编译**。即：**能自动的将html代码中的变量，变成对应的值**。比如我们预先定义的msg应该显示为hello,还能对v-model这样的指令进行解析，让input的value变成对应变量的值...
注释：前端领域的**编译**和我们传统的计算机专业内定义的**编译**有些不同，但是内核精神是一致的。写过c或者java都知道，我们写的程序是一套代码，但是这套代码机器无法直接运行，因为机器只能执行二进制，此处概念的理解可以去看看《编码》这本书，他会告诉你，**cpu的本质，之际就是继电器。**回过头来，因为机器看不懂我们人类系的代码，所以需要**编译器**这个中介，将我们写的这一套代码，转换成机器能够执行的二进制代码。而前端领域中的**模板编译**，指的是将如上图中，页面绑定的各个变量，转换成其真实的值。顺带提一句，webpack中的各种loader也可以看成是各种编译器，如babel-loader，因为浏览器看不懂es6及其之后版本的js代码，那么babel-loader的作用就是转换之。但是总的来说，本质的精神内核是一致的：**自动转换**。

#### 实现我们的编译器Compile函数，完成模板编译工作。
具体的思路很清晰，就是找出存在msg或者info这样的变量所在的地方，然后用我们vue实例对象mv的data中的数据更新。
首先在html文件中引入一个单独的Compile.js文件:
```html
<script src="./Compile.js"></script>
```
Compile也是一个类。入参为当前的实例对象mv。具体代码如下：
```javascript
//  什么叫编译模板--->把template变成dom，如{{变量}}--->真实的数据

class Compile {
    constructor(vm) {
        this.vm = vm
        this.el = vm.$el
        const fragment = this.nodeToFragment()
        this.compile(fragment)
        this.vm.$el.appendChild(fragment)
        // console.log('f', fragment)
        // 编译文档片段，解析{{}}
    }
    // 解析出{{}},变量赋值
    compile(fragment) {
        const nList = fragment.childNodes
        nList.forEach((node) => {
            const nType = node.nodeType
            if (nType === 3) {
                this.compileText(node)
                // 解析文本
            } else if (nType === 1) {
                this.compileElement(node)
                // 元素节点
                
            }
            if (node.childNodes && node.childNodes !== 0) {
                this.compile(node)
            }
        })
    }
    compileElement(node) {
        const attrs = node.attributes
        if (!!attrs.length) {
            const attrsArr = Array.from(attrs)
            attrsArr.forEach((att) => {
                if(att.nodeName === 'v-model') {
                    const val = att.value
                    node.value = this.vm.$data[val]
                }
            })
        }
    }
    compileText(node) {
        const con = node.textContent
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            console.log(node)
            const newVal = con.replace(reg, (...arg) => {
                return this.vm.$data[arg[1]]
            })
            node.textContent = newVal
        }
    }
    nodeToFragment() {
        const f = document.createDocumentFragment()
        while(this.el.firstChild) {
            f.appendChild(this.el.firstChild)
        }
        return f
    }
}
```
逐一解释：
- 1. 两个属性：vm绑定实例mv，el绑定真实的dom。初始化时通过nodeToFragment方法拿到了一个输出，然后调用compile方法，其结果的输出直接被覆盖式的添加到了el中，完成编译工作。
- 2. **nodeToFragment做了啥？**
```javascript
    nodeToFragment() {
        const f = document.createDocumentFragment()
        while(this.el.firstChild) {
            f.appendChild(this.el.firstChild)
        }
        return f
    }
```
创建了一个文档片段，然后自毁式遍历当前的el的儿子元素，依次添加到了文档片段f中。这里需要解释的一点是，当我们将el.firstChild添加到f中后，el的firstChild会变成之前的第二个，以此类推所以称之为自毁。但是呢，dom被添加到f中后，此时页面只会少不会增。可以理解为我们暂时性的找了个盒子，专门用来存放这些真实的dom。所以nodeToFragment函数的作用，就是把所有的真实儿子节点给到了文档片段f。然后以其作为输入，调用compile。
- 3. **compile干了啥？找出所有的data中的变量**
```javascript
    // 解析出{{}},变量赋值
    compile(fragment) {
        const nList = fragment.childNodes
        nList.forEach((node) => {
            const nType = node.nodeType
            if (nType === 3) {
                this.compileText(node)
                // 解析文本
            } else if (nType === 1) {
                this.compileElement(node)
                // 元素节点
                
            }
            if (node.childNodes && node.childNodes !== 0) {
                this.compile(node)
            }
        })
    }
```
该函数就是一个中转函数，然后交给对应的编译节点函数处理。遍历所有的子节点，然后根据nodeType分别处理。nodeType时节点的类型字段，比如，3就是文本text，1就是元素如div。
**对于文本节点的处理：**
```javascript
    compileText(node) {
        const con = node.textContent
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            console.log(node)
            const newVal = con.replace(reg, (...arg) => {
                return this.vm.$data[arg[1]]
            })
            node.textContent = newVal
        }
    }
```
通过textContent属性，获取文本节点的具体内容，然后通过正则匹配双括号的规则，匹配出变量如{{msg}}、{{info}}等。再根据vm.$data中对应的变量值，覆盖文本节点的textContent 。**至此完成文本节点的变量--->值的页面赋值。**

**对于元素节点的处理：**
```javascript
    compileElement(node) {
        const attrs = node.attributes
        if (!!attrs.length) {
            const attrsArr = Array.from(attrs)
            attrsArr.forEach((att) => {
                if(att.nodeName === 'v-model') {
                    const val = att.value
                    node.value = this.vm.$data[val]
                }
            })
        }
    }
```
对元素节点的解析是为了处理像v-model这样的自定应属性。通过attributes属性获取该元素的所有属性。找到v-model对应的变量名，然后改写node.value完成元素节点的变量--->值的页面赋值。

- 4. **将文档片段直接塞入容器dom---el。更新页面中的所有绑定变量数据，完成模板解析。**
```javascript
this.vm.$el.appendChild(fragment)
```

<img src="/img/vue_basic_2.png" alt="插入文档片段，完成编译" width="500">
