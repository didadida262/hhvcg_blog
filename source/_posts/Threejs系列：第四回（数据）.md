---
title: Threejs系列：第四回（数据）
date: 2023-11-24 16:52:35
category: 前端三维系列
---

### 本文我们尝试研究一下threejs的数据表示

绘制图形的两种方式：
1. **直接给点**

```javascript
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0, // v0
        1.0, -1.0,  1.0, // v1
        1.0,  1.0,  1.0, // v2

         1.0,  1.0,  1.0, // v3
        -1.0,  1.0,  1.0, // v4
        -1.0, -1.0,  1.0  // v5
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

```

2. **索引给点**
```javascript
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0, // v0
        1.0, -1.0,  1.0, // v1
        1.0,  1.0,  1.0, // v2

        //  1.0,  1.0,  1.0, // v3
        -1.0,  1.0,  1.0, // v4
        // -1.0, -1.0,  1.0  // v5
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const indexs = new Uint16Array(
    [
        0, 1,2,2, 3, 0
    ]
    )
    geometry.index = new THREE.BufferAttribute(indexs, 1)
```

3. **uv法向量偏移**
uv有自己的坐标系规则，右x正上y正，几个点数据的分别对应上左，上右，下左，下右
```javascript
    // // 物体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.MeshPhongMaterial({
    map: pi,
    color: 0xffffff,
    transparent:true,
    side: THREE.DoubleSide
    })
    const uv = new Float32Array([
    // 顺序： 
    0, 0.5,
    0.5, 0.5,
    0, 0,
    0.5, 0,
    ])
    geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)
    const cube = new THREE.Mesh(geometry, mesh)
```
偏移前：
<img src="/img/uv偏移1.gif" alt="图片描述">

偏移后：
<img src="/img/uv偏移2.gif" alt="图片描述">


