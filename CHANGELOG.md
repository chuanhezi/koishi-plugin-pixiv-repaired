# @chuanhezi/koishi-plugin-pixiv-repaired

> 基于 [@quanhuzeyu/koishi-plugin-pixiv](https://github.com/QuanhuZeYu/koishi-plugin-pixiv) v0.2.7（MIT License）修改

---

## 版本 0.3.2

### 修复 Bug

#### 1. `downloadPixivImg` — 竞态条件导致下载超时

**现象**：日志出现「下载超时」，图片下载失败（「图片获取成功: 数量0」）

**原因**：使用 `page.once("response")` 监听下载响应，`once` 只捕获第一个响应。如果图片 URL 有重定向（302），第一个响应是重定向响应而非图片本体，导致 buffer 为空或超时。

**修复**：直接使用 `page.goto()` 的返回值获取 HTTP 响应，`goto()` 返回的是最终主资源的响应对象，不会受重定向影响。

```javascript
// 旧: once("response") + setTimeout 超时竞态
// 新: const response = await imgPage.goto(picUrl, ...); await response.buffer();
```

#### 2. `ERR_CONNECTION_CLOSED` — 重试间隔不足

**现象**：3 次重试全部失败，报 `net::ERR_CONNECTION_CLOSED`

**修复**：重试间隔加入随机抖动 (jitter)：`1000 * attempt` → `1000 * attempt + Math.random() * 1000`

#### 3. 「查看全部」按钮选择器空指针

**现象**：`TypeError: Cannot read properties of undefined (reading 'click')`（高频出现）

**原因**：单图作品没有「查看全部」按钮，选择器返回 undefined 后仍调用 `.click()`

**修复**：`lookAllDiv.click()` → `lookAllDiv?.click()`

#### 4. `selectSuitablePage` 缺少请求拦截

**现象**：puppeteer 重载后（cycle 调用 `selectSuitablePage`），新页面没有 `setRequestInterception`，导致无法捕获 `pixivNetHeader` 和 `ipximgNetHeader`

**修复**：在 `selectSuitablePage` 末尾添加与 `pupterBrowserInit` 一致的请求拦截设置，重复设置时静默跳过。

#### 5. 多个指令并发操作同一个 Puppeteer 页面

**现象**：多人同时调用普通或 R18 指令时，会共享同一个受控页面，互相覆盖导航状态，可能抓取到错误作品或导致其中一个指令失败。

**修复**：为受控页面增加 FIFO 异步互斥队列。页面初始化、Puppeteer 重载选页和随机取图流程统一串行执行，并在异常情况下通过 `finally` 释放锁，避免后续指令永久阻塞。

#### 6. npm 发布前置脚本无法执行

**现象**：仓库当前以 `lib/index.js` 作为实际发布入口，但 `prepublishOnly` 会调用不可用的 TypeScript 构建流程，导致发布中断。

**修复**：发布前直接使用 Node.js 校验实际入口文件的语法，确保 npm 发布流程能够执行。

#### 7. R18 功能描述与实际页面不一致

**现象**：指令、配置和文档将 R18 来源描述为日榜或排行榜，但程序实际访问的是 Pixiv R18 Discovery 页面。

**修复**：统一改为 R18 Discovery 推荐作品，同时保留原配置键 `R18排行URLs选择器`，避免破坏已有配置。

#### 8. 请求拦截监听器重复注册

**修复**：集中管理受控页面的请求处理器，重新初始化或热重载时先移除旧处理器，确保每个页面只有一个插件请求监听器。

#### 9. `ensureLogin` 关闭后仍会访问 Pixiv

**修复**：每次应用配置时刷新全局上下文，并在插件启动、Puppeteer 恢复和指令执行入口统一检查开关。关闭时不创建或导航页面，并清理此前创建的页面。

#### 10. 源码与构建产物不一致

**修复**：明确 `lib/index.js` 为唯一运行源码，移除不会生成当前插件的旧实验代码，并将构建流程改为入口语法检查和回归测试。

#### 11. 插件接管用户浏览器标签页

**修复**：改用带所有权标记的插件专用页面。配置或模块热重载时复用并重新认领专用页面，旧生命周期卸载时不会误关新实例的页面；插件关闭时移除监听器并关闭页面。

#### 12. 作品跳转和多图展开存在竞态

**修复**：点击缩略图前先注册作品 URL 状态等待，并在进入详情页后等待主图选择器。点击「查看全部」后等待图片 URL 集合及加载状态稳定，再提取下载链接。

---

## 版本 0.0.1

### 修复 Bug

#### 1. 图片下载超时（核心问题）

**现象**：`connect ETIMEDOUT 104.244.43.248:443`

**原因**：`downloadPixivImg` 用 axios 从 Node.js 直连 `i.pximg.net`，不走浏览器代理。

**修复**：改为打开新 browser page → `setExtraHTTPHeaders({ referer: "https://www.pixiv.net/" })` → `page.goto(imageUrl)` → 捕获 `response.buffer()`。利用浏览器网络栈（Proxy + Referer + Cookie）。

```javascript
// 文件: lib/index.js
// 函数: downloadPixivImg

// 旧: axios.get(picUrl, {...}) → ETIMEDOUT
// 新: browser.newPage() → goto(imageUrl, Referer) → response.buffer()
```

---

#### 2. init 阶段 ERR_ABORTED

**现象**：`net::ERR_ABORTED at https://www.pixiv.net/`

**原因**：`selectSuitablePage` 中 `myPage.goto(...)` 未 `await`，遍历所有匹配页面不断触发未处理的导航。

**修复**：加 `await` + `try-catch` + `break`（找到第一个合适页面后停止）。

```javascript
// 文件: lib/index.js
// 函数: selectSuitablePage

// 旧: myPage.goto("https://www.pixiv.net/");  // 无 await
// 新: try { await myPage.goto("https://www.pixiv.net/"); } catch(e) { ... } break;
```

---

#### 3. 图片 JSX 未发送

**现象**：图片下载成功但用户收不到图

**原因**：`randomTJPic` 中 for 循环创建图片 JSX 元素但**未 push 到 message 数组**；`message.join("")` 返回值被丢弃。

**修复**：`message.push(img_jsx)`，删除无效 `join`，去掉多余的 Fragment 包裹。

```javascript
// 文件: lib/index.js
// 函数: randomTJPic

// 旧: jsx(Fragment, { children: jsx("img", {...}) });  // 未 push
// 新: message.push(jsx("img", {...}));
```

---

### 新增功能

#### 4. R18/NSFW 内容支持

**新增命令**：`随机R18涩图`

**新增配置**：`HTMLSelector.R18排行URLs选择器`

**流程**：导航到 `https://www.pixiv.net/discovery?mode=r18` → 通用选择器抓取缩略图 → 随机选取 → 点击 → 下载。

---

#### 5. 定向页面改为 discovery

**普通涩图**：`https://www.pixiv.net/discovery`

**R18涩图**：`https://www.pixiv.net/discovery?mode=r18`

---

#### 6. 通用图片选择器

原选择器依赖页面中有「推荐作品」文字 → 换页即失效。

**新选择器**（同时用于普通和 R18）：

```javascript
// 两级降级：
// 1. img[src*="i.pximg.net"] + naturalWidth > 100 + src 含 "/c/"
// 2. 回退：全部 i.pximg.net 图片
```

适用任意 Pixiv 列表页面。

---

#### 7. 页面加载等待

导航使用 `waitUntil: "networkidle2"` + `waitForSelector('img[src*="i.pximg.net"]')`，确保动态内容渲染完毕后运行选择器。

---

#### 8. 主图像选择器容错

`page.evaluate(主图像URLs选择器)` 加了 `.catch` 防护，详情页 DOM 不匹配时优雅降级。

---

## 修改文件清单

| 文件 | 改动位置 | 内容 |
|------|---------|------|
| `lib/index.js` | `downloadPixivImg` | 新页面 goto 下载替代 axios |
| `lib/index.js` | `selectSuitablePage` | await + try-catch + break |
| `lib/index.js` | `randomTJPic` | 图片 push + isR18 参数 |
| `lib/index.js` | `getRandomTJPic` | isR18 分支 + discovery URL + 通用选择器 + waitForSelector |
| `lib/index.js` | `Config` | 新增 R18排行URLs选择器 |
| `lib/index.js` | `apply` | 新增 随机R18涩图 命令 |
| `lib/index.js` | `usage` | 新增 R18 说明 |
| `lib/index.js` | `主图像URLs选择器调用` | .catch 容错 |
| `lib/index.d.ts` | Config 接口 | 新增 R18排行URLs选择器 类型 |
| `package.json` | name/main/files 等 | 包名/入口/依赖修正 |

---
