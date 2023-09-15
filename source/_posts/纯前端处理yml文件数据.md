---
title: 纯前端处理yml文件数据
date: 2023-09-12 14:29:31
category:
---



```javascript
      // // 解析 YAML 文件内容
      // const data = require('./test.trf')
      // console.log('data>>>', data)
      // const parsedData = yaml.load(data)
      // console.log('parsedData>>>>', parsedData)

      // // 创建 SQLite 数据库（使用浏览器内置的 IndexedDB）
      // const dbPromise = indexedDB.open('myDatabase', 1)

      // // 创建数据表并插入数据
      // dbPromise.onupgradeneeded = (event) => {
      //   const db = event.target.result
      //   const objectStore = db.createObjectStore('people', { keyPath: 'name' })
      //   parsedData.forEach((person) => {
      //     objectStore.add(person)
      //   })
      // }

      // // 处理成功打开数据库的情况
      // dbPromise.onsuccess = (event) => {
      //   console.log('数据库已成功打开')
      // }

      // // 处理数据库打开失败的情况
      // dbPromise.onerror = (event) => {
      //   console.error('数据库打开失败')
      // }
```