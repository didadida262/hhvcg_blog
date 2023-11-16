---
title: electron系列：第一回
date: 2023-11-16 16:49:08
category: 前端的客户端化
---

### 本系列开始，将逐步介绍前端的客户端经典框架--electron（系列文章）
本文主要讲解electron的通信机制

首先祭出一张经典的图：
<img src="/img/webkit_history.jfif" alt="">

electron有且只有一个`主进程`,由`package.json`中的`main`字段定义，Electron 使用 Chromium 来展示 web 页面，每个页面运行在自己的`渲染进程`中。

1. **模式 1：渲染器进程到主进程（单向）**

要将单向 IPC 消息从渲染器进程发送到主进程，您可以使用 ipcRenderer.send API 发送消息，然后使用 ipcMain.on API 接收。

2. **模式 2：渲染器进程到主进程（双向）**
双向 IPC 的一个常见应用是从渲染器进程代码调用主进程模块并等待结果。 这可以通过将 ipcRenderer.invoke 与 ipcMain.handle 搭配使用来完成。

3. **模式 3：主进程到渲染器进程**

将消息从主进程发送到渲染器进程时，需要指定是哪一个渲染器接收消息。 消息需要通过其 WebContents 实例发送到渲染器进程。 此 WebContents 实例包含一个 send 方法，其使用方式与 ipcRenderer.send 相同。

4. **模式 4：渲染器进程到渲染器进程**
没有直接的方法可以使用 ipcMain 和 ipcRenderer 模块在 Electron 中的渲染器进程之间发送消息。 为此，您有两种选择：
- 将主进程作为渲染器之间的消息代理。 这需要将消息从一个渲染器发送到主进程，然后主进程将消息转发到另一个渲染器。
- 从主进程将一个 MessagePort 传递到两个渲染器。 这将允许在初始设置后渲染器之间直接进行通信。