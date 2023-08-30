---
title: Webpack系列：第四回
category: Webpack系列
date: 2023-07-25 01:12:55
tags:
---
**在第三回中，我们将webpack的核心流程捋了一边，但是感觉理解有些不到位。那么为了解决自己的这个“不到位”的感觉，本文尝试去写一个自己的webpack。**


1. 遍历所有模块，将每个模块代码读取出来，替换掉import和export关键字，放到__webpack_modules__对象上。
```javascript
const fs = require("fs");
const parser = require("@babel/parser");
const config = require("../webpack.config"); // 引入配置文件
// 读取入口文件
const fileContent = fs.readFileSync(config.entry, "utf-8");
// 使用babel parser解析AST
const ast = parser.parse(fileContent, { sourceType: "module" });
console.log(ast);   // 把ast打印出来看看
```




2. 整个代码里面除了__webpack_modules__和最后启动的入口是变化的，其他代码，像__webpack_require__，__webpack_require__.r这些方法其实都是固定的，整个代码结构也是固定的，所以完全可以先定义好一个模板。