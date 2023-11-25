---
title: Threejs系列：灯光
date: 2023-11-25 06:46:21
category: 前端三维系列
---

### 本文介绍threejs中的灯光相关设置
<img src="/img/threejs_灯光.png" alt="图片描述">

1. **环境光： 无处不在的光**
   ```javascript
    // 环境光
    const envLight = new THREE.AmbientLight('white', 1)
    scene.add(envLight)
   ```

2. **点光源**
   ```javascript
    // 灯光配置
    const pointLight = new THREE.PointLight(0xffffff,1, 1000)
    pointLight.position.set(2, 3, 2)
    pointLight.castShadow = true
    scene.add(pointLight)
    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize, 'white' );
    scene.add( pointLightHelper );
   ```
注意， 此处我们还加了一个helper帮助显示光源位置

3. **创建物体和地面**
   ```javascript
    // 物体
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const mesh = new THREE.MeshPhongMaterial(
    {
        color: 'black',
        shininess: 1000
    } ); 
    const cube = new THREE.Mesh(geometry, mesh)
    cube.position.set(0, 0.5, 0)
    cube.receiveShadow = true
    cube.castShadow = true
    scene.add(cube)

    // 地面面图形
    const floor = new THREE.Mesh(
    new THREE.PlaneGeometry( 10, 10 ),
    new THREE.MeshPhongMaterial( {color: 0x1b5120, side: THREE.DoubleSide} )
    )
    floor.receiveShadow = true

    // floor.rotation.x -= Math.PI / 2
    floor.rotateX(Math.PI / 2)
    scene.add( floor );
   ```

4. **render配置能显示阴影**
   ```javascript
    renderer.render(scene, camera)
   ```

最终效果如下：
<img src="/img/threejs_阴影.gif" alt="图片描述">

文毕。

