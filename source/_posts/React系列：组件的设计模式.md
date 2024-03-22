---
title: React系列：组件的设计模式
date: 2024-03-22 18:21:32
category: React系列
---

### 本文我们聊聊react组件的设计模式

单一职责，开放封闭

1. `高阶组件`
输入：组件；输出：组件， 实现组件逻辑复用。在前面讲解登陆态持久化的文章中，我们实际上已经实践了高阶组件：

```javascript
const AuthRoute = ({ children}) => {
    const token = getToken()
    if (token) {
        return <>{children}</>
    } else {
        return <Navigate to='/login' replace />
    }
}
```
在`AuthRoute`中，我们将token的判断逻辑扔在了该组件中，其中包裹着目标组件。若有token，跳转到目标页面，否则，跳转到login。高效复用逻辑代码。
