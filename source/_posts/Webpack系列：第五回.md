---
title: Webpack系列：第五回
date: 2023-09-06 02:28:21
category: Webpack系列

---
### 本文作为一个备忘录，主要记录一些常用打包优化的方法

1. **productionSourceMap: false**
   禁止生成map文件
2. **关闭prefetch**
3. **路由懒加载**
   匹配到的时候，再去import
4. **elementui组件库按需加载**
5. **CDN**
6. **gzip压缩代码，compressionPlugin**
7. **图片压缩，如image-webpack-loader**