---
title: Webpack系列：第三回
date: 2023-07-24 22:39:47
tags:
category: Webpack系列
---
### 继前文简单介绍了下前端模块发展史，以此作为铺垫，本文将会简单梳理下webpack的基本打包思路，最终目标，手撕一个自己的webpack

#### 最最精简的webpack打包
```js
(function(modules) { // webpackBootstrap
     // The module cache已经加载过的模块
    var installedModules = {};
    // The require function模块加载函数， 核心
    function __webpack_require__(moduleId) {
        // Check if module is in cache判断模块是否已经加载过，若加载过直接返回加载的模块
        if(installedModules[moduleId]) {
             return installedModules[moduleId].exports;
        }
         // Create a new module (and put it into the cache)
         var module = installedModules[moduleId] = {
             i: moduleId,
             l: false,
            exports: {}
         };

         // Execute the module function执行加载函数
         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

         // Flag the module as loaded标记该模块已经加载
        module.l = true;

        // Return the exports of the module
         return module.exports;
     }
     return __webpack_require__(0) //入口文件

 })([
    // 依赖数组
/* 0 */
 (function(module, exports) {
    module.exports = "Hello World";
 }
 ...
 ...
 )]);
```
#### 1. 从入口文件开始，分析文件的所有依赖
#### 2. 将每一个依赖模块包装起来，放进一个数组中等待调用
- 此处的数组，就是IIFE的入参依赖数组
#### 3. 实现模块加载的方法，并将其放入模块执行的环境中，确保可调用
#### 4. 将执行入口文件的逻辑放在一个函数表达式中，并立即执行这个函数
- 需要注意__webpack_require__是一个递归


- __webpack_modules__
- __webpack_require__





#### 补充webpack的生命周期

1. `beforeRun`：Webpack 进入编译前的阶段，此时会初始化 Compiler 对象。
2. `run`：Webpack 开始编译前的阶段，此时会读取入口文件和依赖，并创建依赖图。
3. `compilation`：Webpack 进入编译阶段，此时会开始编译入口文件和依赖的模块，并生成输出文件。
4. `emit`：Webpack 生成输出文件前的阶段，此时可以在插件中处理生成的输出文件。
5. `done`：Webpack 完成打包后的阶段，此时可以在插件中进行一些清理工作。



