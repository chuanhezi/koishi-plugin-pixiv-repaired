# @chuanhezi/koishi-plugin-pixiv-repaired

[![npm](https://img.shields.io/npm/v/@chuanhezi/koishi-plugin-pixiv-repaired?style=flat-square)](https://www.npmjs.com/package/@chuanhezi/koishi-plugin-pixiv-repaired)

> 基于 [@quanhuzeyu/koishi-plugin-pixiv](https://github.com/QuanhuZeYu/koishi-plugin-pixiv) v0.2.7（MIT License）修复增强版

Pixiv 图片插件增强版 —— 从 Pixiv Discovery 页面随机获取推荐作品，支持普通涩图和 R18 涩图，通过浏览器代理下载图片，**无需手动获取 Cookie**。

## 特性

- ✅ 无需手动配置 Cookie，基于浏览器已登录会话
- ✅ 支持 Pixiv Discovery 推荐作品随机获取
- ✅ 支持从 R18 Discovery 页面随机获取推荐作品（需开启 Pixiv R18 设置）
- ✅ 图片通过浏览器网络栈下载，解决 `i.pximg.net` 直连超时问题
- ✅ 自动展开「查看全部」按钮，获取多图作品的全部图片
- ✅ 返回作品详细信息：标题、作者、标签、喜欢数、收藏数、浏览数

## 依赖说明

| 包名 | 类型 | 说明 |
|------|------|------|
| `koishi` (^4.18.7) | peerDependency | Koishi 机器人框架核心 |
| `koishi-plugin-puppeteer` (^3.9.0) | peerDependency | 浏览器自动化服务，**必须启用** |
| `axios` (^1.7.7) | dependency | HTTP 请求库（预检等辅助请求） |
| `@satorijs/element` (^3.1.7) | dependency | Koishi 消息元素 JSX 运行时 |

## 安装

```bash
# npm
npm install @chuanhezi/koishi-plugin-pixiv-repaired

# 或通过 Koishi 插件市场搜索安装
```

## 配置

### 前置步骤：Puppeteer 配置

在 Koishi 插件市场安装并启用 `koishi-plugin-puppeteer`，然后在 puppeteer 插件设置中添加以下 args：

| 参数 | 说明 |
|------|------|
| `--user-data-dir=/path/to/custom-profile-dir` | 持久化浏览器数据目录，用于保存 Pixiv 登录状态 |
| `--proxy-server=127.0.0.1:<端口>` | 代理服务器（Pixiv 需要访问国外网络） |
| `--no-sandbox` | 禁用沙箱（Linux 服务器必需） |

> **强烈建议关闭 puppeteer 的无头模式。** 插件运行时会打开多个页面，无头模式下无法直观查看浏览器状态，可能不知不觉消耗大量内存。

### 插件配置项

#### 基本设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `ensureLogin` | boolean | `false` | **登录状态开关。** 先在浏览器中打开 pixiv.net 并登录你的账号，登录成功后开启此开关。 |
| `等待NAV超时时间` | number | `15000` | 页面加载与导航的超时时间（毫秒），范围 3000 ~ 60000。 |

#### 高级设置（HTML 选择器）

> ⚠️ 以下为 Pixiv 页面 DOM 元素选择器配置。Pixiv 页面结构变化时需同步更新。

| 配置项 | 说明 |
|--------|------|
| `HTMLSelector.推荐作品URLs选择器` | Discovery 推荐页面的 JS 代码片段，提取作品缩略图 URL |
| `HTMLSelector.R18排行URLs选择器` | R18 Discovery 页面的 JS 代码片段，提取推荐作品缩略图 URL |
| `HTMLSelector.主图像查看全部按钮选择点击` | 点击「查看全部」按钮的 JS 代码，展开多图作品的全部图片 |
| `HTMLSelector.主图像URLs选择器` | 作品详情页中原图 URL 的 JS 提取代码 |

## 可用指令

| 指令 | 说明 |
|------|------|
| `随机涩图` | 从 Pixiv Discovery 推荐作品中随机获取一张图片 |
| `随机R18涩图` | 从 Pixiv R18 Discovery 页面随机获取推荐作品（需先在 Pixiv 设置中开启 R18 显示） |

## 工作原理

```
用户发送指令 → 浏览器导航到 Pixiv Discovery 页面
             → 等待页面图片加载
             → 随机选取一个作品缩略图并点击
             → 进入作品详情页，提取作品信息
             → 点击「查看全部」展开所有图片
             → 通过浏览器页面下载原图
             → 将图片 + 作品信息发送到聊天窗口
```

本插件直接操作 Pixiv 网站（不使用反代站点），通过 puppeteer 控制浏览器自动完成整个流程。

## 更新日志

### v0.3.0

- 重构：使用纯 JS 重写插件
- 指令更新为 `随机涩图` / `随机R18涩图`
- 完善 npm 配置项和依赖说明
- 优化 Koishi 配置页面展示

### v0.2.5

- 修复大量逻辑错误
- 新增获取作品信息功能
- 修改插件引导文案

### v0.1.23

- 修复大量逻辑错误
- 修复配置文件中 undefined 的错误

### v0.1.19

- 更新刷新逻辑，减少不必要的刷新频率

### v0.1.14

- 修复页面刷新逻辑
- 网络较差时使用 try 循环重试

### v0.1.12

- 抽离选择器逻辑到配置文件

### v0.1.11

- 修改作品获取逻辑，提高图像获取成功率和速度

### v0.1.4

- 修复 puppeteer 重载时无法获取页面的问题
- 支持重载 puppeteer 后保持正常运行

### v0.1.3

- 尝试支持无头模式运行
- 初始化页面逻辑改为遍历当前浏览器所有页面

## License

MIT © [chuanhezi](https://github.com/chuanhezi)

原始项目 [@quanhuzeyu/koishi-plugin-pixiv](https://github.com/QuanhuZeYu/koishi-plugin-pixiv) 同样基于 MIT License。
