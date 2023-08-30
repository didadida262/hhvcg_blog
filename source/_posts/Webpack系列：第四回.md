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


```javascript
const fs = require("fs");
let ejs = require('ejs')
const path = require("path")
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const config = require("./diyWebpack.config"); // 引入配置文件
const t = require("@babel/types");
const generate  = require('@babel/generator').default;

const getModuleName = (add) =>{
    return add.split('.')[0]
}
const EXPORT_DEFAULT_FUN = `
__webpack_require__.d(__webpack_exports__, {
   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});\n
`;

const ESMODULE_TAG_FUN = `
__webpack_require__.r(__webpack_exports__);\n
`;

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
  console.log(res[0])
// 使用ejs将上面解析好的ast传递给模板
// 返回最终生成的代码
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