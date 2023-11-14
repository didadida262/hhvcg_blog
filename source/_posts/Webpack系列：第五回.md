---
title: Webpack系列：第五回
date: 2023-09-06 02:28:21
category: Webpack系列

---
### 本文作为一个备忘录，主要记录一些常用打包优化的方法

提高构建速度
1. **productionSourceMap: false**
   禁止生成map文件
2. **启用多线程来提高构建速度**： Teser
 

优化前端性能
1. **关闭prefetch**
2. **路由懒加载**
   匹配到的时候，再去import
3. **elementui组件库按需加载**
4. **CDN**
5. **gzip压缩代码，compressionPlugin**
6. **图片压缩，如image-webpack-loader、file-loader等**
7. **Treeshaking**： 
 - usedExports： 未被使用的模块代码，打包时被自动删除
 - sideEffects： 指定有副作用的模块代码，为false时可以直接删除
 8. **SplitChunks**: 代码分离。将bundlejs分离成更小的文件 