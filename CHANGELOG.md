# @chuanhezi/koishi-plugin-pixiv-repaired

> 基于 [@quanhuzeyu/koishi-plugin-pixiv](https://github.com/QuanhuZeYu/koishi-plugin-pixiv) v0.2.7（MIT License）修改

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

