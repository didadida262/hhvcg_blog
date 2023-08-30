---
title: Webpack系列：第三回
date: 2023-07-24 22:39:47
tags:
category: Webpack系列
---
### 继前文简单介绍了下前端模块发展史，以此作为铺垫，本文将会简单梳理下webpack的基本打包思路，最终目标，手撕一个自己的webpack


#### 1. 从入口文件开始，扫描文件的所有依赖，生成一个包含所有模块的ast数据的数组
- 1. 编写parseFile函数，对file生成ast数据(重点)
```javascript
function parseFile(file) {
    // 读取入口文件
    const fileContent = fs.readFileSync(file, "utf-8");
    // 使用babel parser解析AST
    const ast = parser.parse(fileContent, { sourceType: "module" });
    let importFilePath = "";
    let importVarName = "";
    let importCovertVarName = "";
    let hasExport = false;

    // 使用babel traverse来遍历ast上的节点
    traverse(ast, {
      ImportDeclaration(p) {
        // 获取被import的文件---->  ./helloWorld.js
        const importFile = p.node.source.value;
        // 获取文件路径 helloWorld
        importVarName = p.node.specifiers[0].local.name;
        // ./helloWorld.js
        importFilePath = path.join(path.dirname(file), importFile);
        importFilePath = `./${importFilePath}`;
        // 替换后的变量名字
        // ____WEBPACK_IMPORTED_MODULE_0__
        importCovertVarName = `__${path.basename(
            importFile.split('.')[0]
        )}__WEBPACK_IMPORTED_MODULE_0__`;


        // 构建一个变量定义的AST节点
        const variableDeclaration = t.variableDeclaration("var", [
            t.variableDeclarator(
            t.identifier(
                importCovertVarName
            ),
            t.callExpression(t.identifier("__webpack_require__"), [
                t.stringLiteral(importFilePath),
            ])
            ),
        ]);

        // 将当前节点替换为变量定义节点
        p.replaceWith(variableDeclaration);
      },
      CallExpression(p) {
        // 如果调用的是import进来的函数
        if (p.node.callee.name === importVarName) {
          // 就将它替换为转换后的函数名字
          p.node.callee.name = `${importCovertVarName}.default`;
        }
      },
      Identifier(p) {
        // 如果调用的是import进来的变量
        if (p.node.name === importVarName) {
          // 就将它替换为转换后的变量名字
          p.node.name = `${importCovertVarName}.default`;
        }
      },
      ExportDefaultDeclaration(p) {
        hasExport = true; // 先标记是否有export
        // 跟前面import类似的，创建一个变量定义节点
        const variableDeclaration = t.variableDeclaration("const", [
          t.variableDeclarator(
            t.identifier("__WEBPACK_DEFAULT_EXPORT__"),
            t.identifier(p.node.declaration.name)
          ),
        ]);
  
        // 将当前节点替换为变量定义节点
        p.replaceWith(variableDeclaration);
      },
    });
    let newCode = generate(ast).code;
    if (hasExport) {
        newCode = `${EXPORT_DEFAULT_FUN} ${newCode}`;
      }
      newCode = `${ESMODULE_TAG_FUN} ${newCode}`;

    // 返回一个包含必要信息的新对象
    return {
      file,
      dependencies: [importFilePath],
      code: newCode,
    };
}
```
入参file是一个地址,如通常的入口地址./index.js，通过readFile读取地址文件数据，然后通过parser库将读取的字符串生成一个ast的结构数据。借助工具https://astexplorer.net/，可以直观的展示，其中body是我们的关注重点。如下图所示：
<img src="/img/webpack3_1.jpg" alt="">

示例代码中的四段代码分别对应body中的四种类型。
此时我们要做的第一件事情，就是要将浏览器无法识别的import，转换成其能看得懂的代码
import helloWorld from "./helloWorld.js";
--->
var ____WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./helloWorld.js");
如何实现？借助babel的traverse，遍历ast上的节点，然后针对于ImportDeclaration类型，做一些处理。
```javascript
      ImportDeclaration(p) {
        // 获取被import的文件---->  ./helloWorld.js
        const importFile = p.node.source.value;
        // 获取文件路径 helloWorld
        importVarName = p.node.specifiers[0].local.name;
        // ./helloWorld.js
        importFilePath = path.join(path.dirname(file), importFile);
        importFilePath = `./${importFilePath}`;
        // 替换后的变量名字
        // ____WEBPACK_IMPORTED_MODULE_0__
        importCovertVarName = `__${path.basename(
            importFile.split('.')[0]
        )}__WEBPACK_IMPORTED_MODULE_0__`;

        // 构建一个变量定义的AST节点
        const variableDeclaration = t.variableDeclaration("var", [
            t.variableDeclarator(
                t.identifier(
                    importCovertVarName
                ),
                t.callExpression(t.identifier("__webpack_require__"), [
                    t.stringLiteral(importFilePath),
                ])
            ),
        ]);

        // 将当前节点替换为变量定义节点
        p.replaceWith(variableDeclaration);
      },
```
一些细节性的名称处理，生成最终我们想要的结构，然后将结果replace到原始节点，完成转换。
- 针对调用的是import进来的函数,在CallExpression配置。如
const helloWorldStr = helloWorld();
--->
const helloWorldStr = ____WEBPACK_IMPORTED_MODULE_0__.default();

```javascript
      CallExpression(p) {
        // 如果调用的是import进来的函数
        if (p.node.callee.name === importVarName) {
          // 就将它替换为转换后的函数名字
          p.node.callee.name = `${importCovertVarName}.default`;
        }
      },
```
- 针对调用进来的变量，在Identifier中处理。
```javascript
      Identifier(p) {
        // 如果调用的是import进来的变量
        if (p.node.name === importVarName) {
          // 就将它替换为转换后的变量名字
          p.node.name = `${importCovertVarName}.default`;
        }
      },
```
- 浏览器无法识别import，export亦是如此。针对是导出的模块，ExportDefaultDeclaration处理
export default helloWorld;
--->
const __WEBPACK_DEFAULT_EXPORT__ = helloWorld;

```javascript
      ExportDefaultDeclaration(p) {
        hasExport = true; // 先标记是否有export
        // 跟前面import类似的，创建一个变量定义节点
        const variableDeclaration = t.variableDeclaration("const", [
          t.variableDeclarator(
            t.identifier("__WEBPACK_DEFAULT_EXPORT__"),
            t.identifier(p.node.declaration.name)
          ),
        ]);
  
        // 将当前节点替换为变量定义节点
        p.replaceWith(variableDeclaration);
      },
```
此时，已经基本实现对一个file的解析工作。parse的输出结构如下：
```javascript
    // 返回一个包含必要信息的新对象
    return {
      file,
      dependencies: [importFilePath],
      code: newCode,
    };
```
- 递归扫描，生成最终的模块数组
```javascript
function parseFiles(entryFile) {
    const entryRes = parseFile(entryFile); // 解析入口文件

    const results = [entryRes]; // 将解析结果放入一个数组
    // 循环结果数组，将它的依赖全部拿出来解析
    for (const res of results) {
        const dependencies = res.dependencies;
        dependencies.map((dependency) => {
        if (dependency && dependency !== '.js') {
            const ast = parseFile(dependency);
            results.push(ast);
        }
        });
    }
    return results;
}
  const res = parseFiles(config.entry)
```
config.entry就是我们常配置的入口文件地址，从此处出发，生成所有模块数据。

#### 2. 有了所有模块的ast数据和入口，借助ejs，以模板为基础，生成最终的浏览器能够看得懂的dist文件。
```javascript
function generateCode(allAst, entry) {
    const temlateFile = fs.readFileSync(
      path.join(__dirname, "./template.js"),
      "utf-8"
    );
  
    const codes = ejs.render(temlateFile, {
      __TO_REPLACE_WEBPACK_MODULES__: allAst,
      __TO_REPLACE_WEBPACK_ENTRY__: entry,
    });
  
    return codes;
  }

const codes = generateCode(res, config.entry);
fs.writeFileSync(path.join(config.output.path, config.output.filename), codes);
```
其中的template模板代码如下；
```javascript
function generateCode(allAst, entry) {
    const temlateFile = fs.readFileSync(
      path.join(__dirname, "./template.js"),
      "utf-8"
    );
  
    const codes = ejs.render(temlateFile, {
      __TO_REPLACE_WEBPACK_MODULES__: allAst,
      __TO_REPLACE_WEBPACK_ENTRY__: entry,
    });
  
    return codes;
  }

const codes = generateCode(res, config.entry);
fs.writeFileSync(path.join(config.output.path, config.output.filename), codes);
```
完成我们的diy需求。
<!-- #### 2. 将每一个依赖模块包装起来，放进一个数组中等待调用
- 此处的数组，就是IIFE的入参依赖数组
#### 3. 实现模块加载的方法，并将其放入模块执行的环境中，确保可调用
#### 4. 将执行入口文件的逻辑放在一个函数表达式中，并立即执行这个函数
- 需要注意__webpack_require__是一个递归 -->




#### 补充webpack的生命周期

1. `beforeRun`：Webpack 进入编译前的阶段，此时会初始化 Compiler 对象。
2. `run`：Webpack 开始编译前的阶段，此时会读取入口文件和依赖，并创建依赖图。
3. `compilation`：Webpack 进入编译阶段，此时会开始编译入口文件和依赖的模块，并生成输出文件。
4. `emit`：Webpack 生成输出文件前的阶段，此时可以在插件中处理生成的输出文件。
5. `done`：Webpack 完成打包后的阶段，此时可以在插件中进行一些清理工作。



