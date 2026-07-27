var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// Plugin exports
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  usage: () => usage
});
module.exports = __toCommonJS(src_exports);
var import_koishi2 = require("koishi");
var import_fs = require("fs");

// Shared plugin state
var import_path = __toESM(require("path"));
var import_os = __toESM(require("os"));
var ctx;
var logger;
var koishiBaseDir;
var myPluginDataDir;
var myBrowserUserDataDir;
var puppeteer;
var browserExecutePath;
var controledPage;
var pixivNetHeader;
var iPximgNetHeader;
var controlledPageLockStateKey = Symbol.for("@chuanhezi/koishi-plugin-pixiv-repaired/page-lock");
var controlledPageLockState = globalThis[controlledPageLockStateKey];
if (!controlledPageLockState) {
  controlledPageLockState = { tail: Promise.resolve() };
  globalThis[controlledPageLockStateKey] = controlledPageLockState;
}
async function withControlledPageLock(operation) {
  const previousOperation = controlledPageLockState.tail;
  let releaseLock;
  controlledPageLockState.tail = new Promise((resolve) => {
    releaseLock = resolve;
  });
  await previousOperation;
  try {
    return await operation();
  } finally {
    releaseLock();
  }
}
__name(withControlledPageLock, "withControlledPageLock");
function inintAllBaseData(ctx2) {
  setCTX(ctx2);
  setLogger(ctx2.logger);
  logger.info("正在初始化资源...");
  initKoishiBaseDir(ctx2.baseDir);
  logger.info(`获取Koishi插件的Data目录: ${koishiBaseDir}`);
  initMyPluginDataDir();
  logger.info(`获取插件的Data目录: ${myPluginDataDir}`);
  initPuppeteer(ctx2);
  logger.info("资源初始化完毕");
  initBrowserExecutePath(ctx2.config);
}
__name(inintAllBaseData, "inintAllBaseData");
function setLogger(_) {
  logger = _;
}
__name(setLogger, "setLogger");
function getLogger() {
  return logger;
}
__name(getLogger, "getLogger");
function getKoishiBaseDir() {
  return koishiBaseDir;
}
__name(getKoishiBaseDir, "getKoishiBaseDir");
function initKoishiBaseDir(dir) {
  koishiBaseDir = dir;
}
__name(initKoishiBaseDir, "initKoishiBaseDir");
function getMyPluginDataDir() {
  return myPluginDataDir;
}
__name(getMyPluginDataDir, "getMyPluginDataDir");
function initMyPluginDataDir() {
  const baseDir = getKoishiBaseDir();
  myPluginDataDir = import_path.default.resolve(baseDir, "data/@QuanhuZeYu/pixiv");
}
__name(initMyPluginDataDir, "initMyPluginDataDir");
function initMyBrowserUserDataDir() {
  const userDataDir = import_path.default.resolve(myPluginDataDir, "chromeData");
  myBrowserUserDataDir = userDataDir;
}
__name(initMyBrowserUserDataDir, "initMyBrowserUserDataDir");
function getMyUserDataDir() {
  return myBrowserUserDataDir;
}
__name(getMyUserDataDir, "getMyUserDataDir");
function getPuppeteer() {
  return puppeteer;
}
__name(getPuppeteer, "getPuppeteer");
function initPuppeteer(ctx2) {
  puppeteer = ctx2.puppeteer;
}
__name(initPuppeteer, "initPuppeteer");
function initBrowserExecutePath(path2) {
  browserExecutePath = path2;
}
__name(initBrowserExecutePath, "initBrowserExecutePath");
function setCTX(ctx_) {
  ctx = ctx_;
}
__name(setCTX, "setCTX");
function getCTX() {
  return ctx;
}
__name(getCTX, "getCTX");
function setCurPage(p) {
  controledPage = p;
}
__name(setCurPage, "setCurPage");
function getCurPage() {
  return controledPage;
}
__name(getCurPage, "getCurPage");
function setPixivNetHeader(h) {
  pixivNetHeader = h;
}
__name(setPixivNetHeader, "setPixivNetHeader");
function getPixivNetHeader() {
  return pixivNetHeader;
}
__name(getPixivNetHeader, "getPixivNetHeader");
function setIpximgNetHeader(h) {
  iPximgNetHeader = h;
}
__name(setIpximgNetHeader, "setIpximgNetHeader");
function getIpximgNetHeader() {
  return iPximgNetHeader;
}
__name(getIpximgNetHeader, "getIpximgNetHeader");
var baseData = {
  inintAllBaseData,
  setLogger,
  initKoishiBaseDir,
  initMyPluginDataDir,
  initMyBrowserUserDataDir,
  initPuppeteer,
  setCTX,
  setCurPage,
  setPixivNetHeader,
  setIpximgNetHeader,
  getLogger,
  getKoishiBaseDir,
  getMyPluginDataDir,
  getMyUserDataDir,
  getPuppeteer,
  getCTX,
  getCurPage,
  getPixivNetHeader,
  getIpximgNetHeader
};
var baseData_default = baseData;

// Data facade
var Data = {
  baseData: baseData_default
};
var index_default = Data;

// Pre-initialization
var started = false;
async function preInit(ctx2) {
  index_default.baseData.inintAllBaseData(ctx2);
  started = true;
}
__name(preInit, "preInit");
var preInit_default = preInit;

// Pixiv browser controller
var import_axios = __toESM(require("axios"));
var import_koishi = require("koishi");
var requestInterceptionHandlerKey = Symbol.for("@chuanhezi/koishi-plugin-pixiv-repaired/request-handler");
var controlledPageOwnerKey = Symbol.for("@chuanhezi/koishi-plugin-pixiv-repaired/page-owner");
var activeControlledPageOwner;
async function installPixivRequestInterception(page) {
  await page.setRequestInterception(true);
  const previousHandler = page[requestInterceptionHandlerKey];
  if (previousHandler) {
    page.off("request", previousHandler);
  }
  const requestHandler = async (request) => {
    const logger2 = index_default.baseData.getLogger();
    try {
      const domain = new URL(request.url()).hostname;
      if (domain === "www.pixiv.net") {
        const header = {
          ...index_default.baseData.getPixivNetHeader() || {},
          ...request.headers()
        };
        index_default.baseData.setPixivNetHeader(header);
      } else if (domain === "i.pximg.net") {
        const header = {
          ...index_default.baseData.getIpximgNetHeader() || {},
          ...request.headers()
        };
        index_default.baseData.setIpximgNetHeader(header);
      }
    } catch (error) {
      logger2.warn(`记录 Pixiv 请求头失败: ${error?.message || error}`);
    }
    try {
      if (typeof request.isInterceptResolutionHandled !== "function" || !request.isInterceptResolutionHandled()) {
        await request.continue();
      }
    } catch (error) {
      logger2.warn(`继续浏览器请求失败: ${error?.message || error}`);
    }
  };
  page.on("request", requestHandler);
  page[requestInterceptionHandlerKey] = requestHandler;
}
__name(installPixivRequestInterception, "installPixivRequestInterception");
function isPageUsable(page) {
  return Boolean(page) && (typeof page.isClosed !== "function" || !page.isClosed());
}
__name(isPageUsable, "isPageUsable");
async function getOrCreateControlledPage() {
  let page = index_default.baseData.getCurPage();
  if (!isPageUsable(page) || !page[controlledPageOwnerKey]) {
    const pages = await index_default.baseData.getPuppeteer().browser.pages();
    page = pages.find((candidate) => isPageUsable(candidate) && candidate[controlledPageOwnerKey]);
  }
  if (!page) {
    page = await index_default.baseData.getPuppeteer().browser.newPage();
  }
  page[controlledPageOwnerKey] = activeControlledPageOwner;
  return page;
}
__name(getOrCreateControlledPage, "getOrCreateControlledPage");
async function releaseControlledPages(browser, owner, releaseAnyOwner = false) {
  const logger2 = index_default.baseData.getLogger();
  let pages = [];
  try {
    pages = await browser.pages();
  } catch (error) {
    logger2.warn(`获取待清理页面失败: ${error?.message || error}`);
  }
  const currentPage = index_default.baseData.getCurPage();
  if (currentPage && !pages.includes(currentPage)) pages.push(currentPage);
  for (const page of pages) {
    const pageOwner = page?.[controlledPageOwnerKey];
    if (!pageOwner || !releaseAnyOwner && pageOwner !== owner) continue;
    const requestHandler = page[requestInterceptionHandlerKey];
    if (requestHandler) {
      page.off("request", requestHandler);
      delete page[requestInterceptionHandlerKey];
    }
    delete page[controlledPageOwnerKey];
    if (isPageUsable(page)) {
      try {
        await page.close();
      } catch (error) {
        logger2.warn(`关闭 Pixiv 插件页面失败: ${error?.message || error}`);
      }
    }
    if (page === currentPage) index_default.baseData.setCurPage(void 0);
  }
}
__name(releaseControlledPages, "releaseControlledPages");
async function pupterBrowserInit(ctx2) {
  return withControlledPageLock(() => pupterBrowserInitUnlocked(ctx2));
}
__name(pupterBrowserInit, "pupterBrowserInit");
async function pupterBrowserInitUnlocked(ctx2) {
  const logger2 = ctx2.logger;
  if (ctx2.config.ensureLogin !== true) {
    logger2.warn("当前状态为未登录，将不会进行页面初始化");
    return;
  }
  const myPage = await getOrCreateControlledPage();
  await installPixivRequestInterception(myPage);
  await myPage.bringToFront();
  await myPage.goto("https://www.pixiv.net/");
  baseData_default.setCurPage(myPage);
}
__name(pupterBrowserInitUnlocked, "pupterBrowserInitUnlocked");
async function getRandomTJPic(isR18 = false) {
  return withControlledPageLock(() => getRandomTJPicUnlocked(isR18));
}
__name(getRandomTJPic, "getRandomTJPic");
async function getRandomTJPicUnlocked(isR18 = false) {
  const logger2 = index_default.baseData.getLogger();
  const config2 = index_default.baseData.getCTX().config;
  if (config2.ensureLogin !== true) {
    return [[], "Pixiv 插件尚未启用，请管理员确认登录后开启 ensureLogin。"];
  }
  let page = baseData_default.getCurPage();
  const targetURL = isR18 ? "https://www.pixiv.net/discovery?mode=r18" : "https://www.pixiv.net/discovery";
  const urlSelector = isR18 ? config2.HTMLSelector.R18排行URLs选择器 : config2.HTMLSelector.推荐作品URLs选择器;
  const sectionLabel = isR18 ? "R18推荐作品" : "推荐作品";
  try {
    logger2.info(`正在查找${sectionLabel}`);
    try {
      await page.bringToFront();
    } catch (e) {
      logger2.warn(`当前页面已失效，正在重新获取页面: ${e.message}`);
      await selectSuitablePage();
      page = baseData_default.getCurPage();
    }
    logger2.info(`正在导航到: ${targetURL}`);
    await page.goto(targetURL, { waitUntil: "networkidle2" });
    try {
      await page.waitForSelector('img[src*="i.pximg.net"]', { timeout: 15e3 });
      logger2.info("页面图片已加载");
    } catch (e) {
      logger2.warn("等待页面图片超时，尝试继续");
    }
    const imgSelector = await page.evaluate(urlSelector);
    if (!imgSelector || imgSelector.length === 0) {
      logger2.warn(`未找到 \"${sectionLabel}\" 块或其中的图片！`);
      return [[], `未找到${sectionLabel}`];
    }
    const randomIndex = getRandomInt(0, imgSelector.length - 1);
    const imgURL = imgSelector[randomIndex];
    logger2.info(`随机选择的第${randomIndex}张图片: ${imgURL}`);
    const imgElement = await page.$(`img[src="${imgURL}"]`);
    if (!imgElement) {
      logger2.warn("未找到对应的图片元素");
      return [[], "未找到对应的图片元素"];
    }
    const discoveryURL = page.url();
    logger2.info("正在打开作品并等待详情页加载");
    try {
      await Promise.all([
        page.waitForFunction(
          (previousURL) => location.href !== previousURL && /\/artworks\/\d+/.test(location.pathname),
          { timeout: config2.等待NAV超时时间 },
          discoveryURL
        ),
        imgElement.click()
      ]);
      await page.waitForSelector("main section figure img", { timeout: config2.等待NAV超时时间 });
      logger2.info("选择器找到，开始解析图片URL");
    } catch (error) {
      throw new Error(`打开作品详情页失败: ${error?.message || error}`);
    }
    logger2.info("等待图片加载已结束");
    const artInfo = await index_default2.pageController.getArtWorkInfo(page);
    try {
      await page.evaluate(config2.HTMLSelector.主图像查看全部按钮选择点击);
      await waitForArtworkImagesStable(page, config2.等待NAV超时时间);
    } catch (error) {
      logger2.warn(`没有找到查看全部按钮，继续执行逻辑: ${error}`);
    }
    const bigPicURLs = await page.evaluate(config2.HTMLSelector.主图像URLs选择器).catch((error) => {
      logger2.warn(`获取主图像URL失败，可能是页面结构不匹配: ${error}`);
      return [];
    });
    logger2.info(`从浏览器中获取到的图片链接: ${bigPicURLs}`);
    const pics = [];
    for (const url of bigPicURLs) {
      try {
        const pic = await downloadPixivImg(url);
        pics.push(pic);
      } catch (error) {
        logger2.warn(`下载图片失败: ${url}, 错误: ${error}`);
      }
    }
    return [pics, artInfo];
  } catch (error) {
    logger2.error(`发生错误: ${error}`);
    return [[], error];
  } finally {
    logger2.info(isR18 ? "正在返回R18 Discovery页面" : "正在返回主页");
    try {
      await page.goto(targetURL);
    } catch (e) {
      logger2.warn(`返回页面时出错: ${e.message}`);
    }
    baseData_default.setCurPage(page);
  }
}
__name(getRandomTJPicUnlocked, "getRandomTJPicUnlocked");
async function waitForArtworkImagesStable(page, timeout) {
  const maxWait = Math.max(1e3, Math.min(timeout || 5e3, 5e3));
  await page.evaluate((timeoutMs) => new Promise((resolve) => {
    const startedAt = Date.now();
    let lastSignature = "";
    let stableSince = startedAt;
    const check = () => {
      const images = Array.from(document.querySelectorAll("main section figure img"));
      const signature = images.map((image) => image.currentSrc || image.src).join("|");
      if (signature !== lastSignature) {
        lastSignature = signature;
        stableSince = Date.now();
      }
      const loaded = images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
      const elapsed = Date.now() - startedAt;
      if (loaded && elapsed >= 750 && Date.now() - stableSince >= 500 || elapsed >= timeoutMs) {
        resolve();
        return;
      }
      setTimeout(check, 100);
    };
    check();
  }), maxWait);
}
__name(waitForArtworkImagesStable, "waitForArtworkImagesStable");
var browser = {
  pupterBrowserInit,
  getRandomTJPic
};
var mainPage_default = browser;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
__name(getRandomInt, "getRandomInt");
async function downloadPixivImg(picUrl) {
  const logger2 = index_default.baseData.getLogger();
  const puppeteer2 = index_default.baseData.getPuppeteer();
  const retries = 3;
  for (let attempt = 1; attempt <= retries; attempt++) {
    let imgPage;
    try {
      imgPage = await puppeteer2.browser.newPage();
      const imgHeaders = index_default.baseData.getIpximgNetHeader() || {};
      await imgPage.setExtraHTTPHeaders({ ...imgHeaders, referer: "https://www.pixiv.net/" });
      const response = await imgPage.goto(picUrl, { waitUntil: "load", timeout: 30e3 });
      if (!response || !response.ok()) {
        throw new Error(`下载失败: HTTP ${response?.status() || "\u65E0\u54CD\u5E94"}`);
      }
      const buffer = await response.buffer();
      logger2.info("图片下载成功");
      return buffer;
    } catch (error) {
      const errMsg = error?.message || String(error);
      logger2.warn(`下载图片失败 (第${attempt}/${retries}次): ${errMsg}`);
      if (attempt === retries) {
        logger2.error(`下载图片时发生错误: `);
        logger2.error(error);
        throw error;
      }
      await new Promise(r => setTimeout(r, 1000 * attempt + Math.random() * 1000));
    } finally {
      if (imgPage) {
        try { await imgPage.close(); } catch (_) {}
      }
    }
  }
}
__name(downloadPixivImg, "downloadPixivImg");

// Navigation helpers
async function waitNav(page) {
  await page.waitForNavigation({ timeout: index_default.baseData.getCTX().config.等待NAV超时时间 });
}
__name(waitNav, "waitNav");
var waitFunc = {
  waitNav
};
var waitFunc_default = waitFunc;

// Artwork metadata parser
async function getArtWorkInfo(p) {
  const logger2 = index_default.baseData.getLogger();
  const artWorkInfo = await p.evaluate(() => {
    try {
      const authorSection = document.querySelector("main")?.nextElementSibling?.querySelector("section");
      const authorName = authorSection?.querySelectorAll("a")[1]?.textContent?.trim() || "未知";
      const authorNumber = authorSection?.querySelectorAll("a")[1]?.getAttribute("href");
      const infoSection = document.querySelector("section figcaption");
      if (!infoSection) throw new Error("无法找到作品信息区域");
      const footerSection = infoSection.querySelector("footer");
      if (!footerSection) throw new Error("无法找到页脚信息区域");
      const tags = footerSection.querySelectorAll("li");
      const hotInfo = footerSection.nextElementSibling?.querySelectorAll("li");
      const timeSection = footerSection.nextElementSibling?.nextElementSibling;
      const tagString = [];
      tags.forEach((li) => {
        const tagInfo = li.querySelectorAll("span");
        if (tagInfo.length >= 3) {
          const tagText = tagInfo[1]?.textContent?.trim() || "";
          const tagLinkText = tagInfo[2]?.querySelector("a")?.textContent?.trim() || "";
          tagString.push(`#${tagText} ${tagLinkText}`);
        } else if (tagInfo.length === 2) {
          tagString.push(`#${tagInfo[0]?.textContent?.trim()}`);
        }
      });
      const likeCount = hotInfo?.[0]?.textContent?.trim() || "0";
      const collectionCount = hotInfo?.[1]?.textContent?.trim() || "0";
      const viewCount = hotInfo?.[2]?.textContent?.trim() || "0";
      const time = timeSection?.querySelector("time")?.textContent?.trim() || "未知";
      const title0Section = infoSection.querySelector("h1");
      if (title0Section) {
        const title1Section = title0Section.nextElementSibling;
        const title0 = title0Section.textContent?.trim() || "无";
        const title1 = title1Section?.textContent?.trim() || "无";
        return `作品名称: ${title0}
作者: ${authorName} 作者ID:${authorNumber}
tags: ${tagString.join(" ")}`;
      } else {
        return `作品名称: 无
作者: ${authorName} 作者ID: ${authorNumber}
tags: ${tagString.join(" ")}`;
      }
    } catch (error) {
      console.error("Error fetching artwork info:", error);
      return "无法获取作品信息";
    }
  });
  return artWorkInfo;
}
__name(getArtWorkInfo, "getArtWorkInfo");
var getPixivArtworkInfo_default = getArtWorkInfo;

// Page controller facade
var pageController = {
  getArtWorkInfo: getPixivArtworkInfo_default
};
var index_default3 = pageController;

// Browser facade
var chrome = {
  browser: mainPage_default,
  waitFunc: waitFunc_default,
  pageController: index_default3
};
var index_default2 = chrome;

// Browser initialization
function init(ctx2) {
  index_default2.browser.pupterBrowserInit(ctx2);
}
__name(init, "init");
var init_default = init;

// Browser recovery
async function cycle(ctx2) {
  return withControlledPageLock(() => cycleUnlocked(ctx2));
}
__name(cycle, "cycle");
async function cycleUnlocked(ctx2) {
  if (!started || ctx2.config.ensureLogin !== true) {
    return;
  }
  index_default.baseData.setCTX(ctx2);
  const logger2 = ctx2.logger;
  logger2.info("正在尝试获取新的puppeteer");
  index_default.baseData.initPuppeteer(ctx2);
  logger2.info(`正在寻找合适的页面`);
  await selectSuitablePage();
  logger2.info("重新获取logger");
  index_default.baseData.setLogger(logger2);
}
__name(cycleUnlocked, "cycleUnlocked");
var cir_default = cycle;
async function selectSuitablePage() {
  const logger2 = index_default.baseData.getLogger();
  const myPage = await getOrCreateControlledPage();
  try {
    await installPixivRequestInterception(myPage);
  } catch (e) {
    logger2.warn(`设置请求拦截失败: ${e.message}`);
  }
  try {
    await myPage.goto("https://www.pixiv.net/");
  } catch (e) {
    logger2.warn(`页面导航到pixiv失败: ${e}`);
  }
  try {
    logger2.info(`page设置完毕: ${myPage.url()}`);
  } catch (e) {
    logger2.warn(`无法获取页面URL: ${e}`);
  }
  index_default.baseData.setCurPage(myPage);
}
__name(selectSuitablePage, "selectSuitablePage");

// Lifecycle facade
var Event = {
  preInit: preInit_default,
  init: init_default,
  cycle: cir_default
};
var index_default4 = Event;

// Random artwork command
var import_jsx_runtime = require("@satorijs/element/jsx-runtime");
async function compressImageIfNeeded(pic) {
  if (pic.length <= 204800) return pic;
  const logger2 = index_default.baseData.getLogger();
  logger2.info(`\u56FE\u7247\u5927\u5C0F ${(pic.length / 1024).toFixed(0)}KB \u8D85\u8FC7 200KB \u9650\u5236\uFF0C\u6B63\u5728\u538B\u7F29...`);
  const puppeteer2 = index_default.baseData.getPuppeteer();
  const dataUrl = `data:image/png;base64,${pic.toString("base64")}`;
  let page;
  try {
    page = await puppeteer2.browser.newPage();
    await page.setContent(`<canvas id="c"></canvas><script>const img=new Image();img.onload=function(){const c=document.getElementById("c");const mw=1920,mh=1920;let w=img.naturalWidth,h=img.naturalHeight;if(w>mw||h>mh){const r=Math.min(mw/w,mh/h);w=Math.round(w*r);h=Math.round(h*r)}c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h)};img.onerror=function(){document.title="ERR"};img.src="${dataUrl}";</script>`);
    await page.waitForFunction(() => { const c = document.getElementById("c"); return c && c.width > 0 || document.title === "ERR"; }, { timeout: 15e3 });
    if (await page.title() === "ERR") {
      logger2.warn("\u538B\u7F29\u5931\u8D25\uFF1A\u56FE\u7247\u52A0\u8F7D\u9519\u8BEF\uFF0C\u4F7F\u7528\u539F\u56FE");
      return pic;
    }
    const TARGET_SIZE = 204800;
    const qualities = [0.85, 0.7, 0.55, 0.4, 0.25, 0.15];
    let compressed = null;
    for (const q of qualities) {
      const compressedDataUrl = await page.evaluate((quality) => document.getElementById("c").toDataURL("image/jpeg", quality), q);
      compressed = Buffer.from(compressedDataUrl.split(",")[1], "base64");
      logger2.info(`\u5C1D\u8BD5\u8D28\u91CF q=${q}: ${(compressed.length / 1048576).toFixed(2)}MB`);
      if (compressed.length <= TARGET_SIZE) break;
    }
    logger2.info(`\u538B\u7F29\u5B8C\u6210: ${(pic.length / 1048576).toFixed(2)}MB \u2192 ${(compressed.length / 1048576).toFixed(2)}MB`);
    return compressed;
  } catch (e) {
    logger2.warn(`\u538B\u7F29\u5931\u8D25: ${e.message}\uFF0C\u4F7F\u7528\u539F\u56FE`);
    return pic;
  } finally {
    if (page) try { await page.close(); } catch (_) { }
  }
}
__name(compressImageIfNeeded, "compressImageIfNeeded");
async function randomTJPic(av, ms, isR18 = false) {
  let message;
  const logger2 = index_default.baseData.getLogger();
  const ss = av.session;
  logger2.info(isR18 ? "正在随机获取R18图片" : "正在随机获取图片");
  message = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("message", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("quote", { id: ss.messageId }),
    "你在此地不要走动"
  ] });
  await ss.send(message);
  message = [];
  try {
    const [picBuffers, artInfo] = await index_default2.browser.getRandomTJPic(isR18);
    logger2.info(`图片获取成功: 数量${picBuffers?.length}`);
    for (const pic of picBuffers) {
      const compressed = await compressImageIfNeeded(pic);
      const tmpDir = import_os.default.tmpdir();
      const tmpPath = import_path.default.join(tmpDir, `pixiv_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
      import_fs.writeFileSync(tmpPath, compressed);
      const fileUrl = "file:///" + tmpPath.replace(/\\/g, "/");
      message.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: fileUrl }));
    }
    message.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: artInfo }));
    message = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("message", { children: message });
    await ss.send(message);
  } catch (e) {
    logger2.warn(`获取失败，失败信息: ${e}`);
    ss.send("获取失败，请联系管理员查看控制台");
  }
}
__name(randomTJPic, "randomTJPic");
var randomPic_default = randomTJPic;

// Command facade
var commands = {
  randomTJPic: randomPic_default
};
var index_default5 = commands;

// Koishi plugin entry
var name = "pixiv";
var usage = "第一次使用本插件时请在puppeteer服务中设置args: `--user-data-dir=/path/to/custom-profile-dir` 否则无法记录登录信息\n\n本插件没有使用反代站点，直接操作pixiv网站，所以需要能访问国外网络，在puppeteer服务中添加args `--proxy-server=127.0.0.1:<端口>`\n\n且强烈推荐关闭无头模式，因为插件可能会打开很多页面，如果你开了无头模式可能会不知不觉吃掉很多内存和性能，关掉无头随时查看浏览器\n\n使用 `随机涩图` 即可随机获取一张p站推荐作品中的图片~~~\n\n使用 `随机R18涩图` 即可从p站R18 Discovery页面随机获取推荐作品（需先在pixiv设置中开启R18显示）";
var inject = {
  required: ["puppeteer"]
};
var Config = import_koishi2.Schema.object({
  // excutePath: Schema.string().description("puppeteer的chrome路径或者chromium路径").required(),
  ensureLogin: import_koishi2.Schema.boolean().description("请在确认登录过pixiv后再打开此开关!").default(false),
  等待NAV超时时间: import_koishi2.Schema.number().description("等待NAV超时时间，单位ms").default(15e3),
  HTMLSelector: import_koishi2.Schema.object({
    推荐作品URLs选择器: import_koishi2.Schema.string().description("推荐/发现页面的图片选择器，返回所有作品缩略图URLs数组。可在浏览器控制台调试修改").default("(() => {const urls = [];const imgs = document.querySelectorAll('img[src*=\"i.pximg.net\"]');for (const img of imgs) {if (img.naturalWidth > 100 && img.src.includes('/c/')) {urls.push(img.src);}}if (urls.length === 0) {document.querySelectorAll('img[src*=\"i.pximg.net\"]').forEach(img => urls.push(img.src));}return urls;})()"),
    R18排行URLs选择器: import_koishi2.Schema.string().description("R18 Discovery页面的图片选择器，返回推荐作品缩略图URLs数组。可在浏览器控制台调试修改").default("(() => {const urls = [];const imgs = document.querySelectorAll('img[src*=\"i.pximg.net\"]');for (const img of imgs) {if (img.naturalWidth > 100 && img.src.includes('/c/')) {urls.push(img.src);}}if (urls.length === 0) {document.querySelectorAll('img[src*=\"i.pximg.net\"]').forEach(img => urls.push(img.src));}return urls;})()"),
    主图像查看全部按钮选择点击: import_koishi2.Schema.string().description("如果你不知道这是什么请不要动它！！！这个选择器是尝试找查看全部按钮然后展开全部作品，方便获取所有图片").default("const buttonsDivs = Array.from(document.querySelectorAll(`main button div`));const lookAllDiv = buttonsDivs.find(div => div.textContent.includes(`查看全部`));lookAllDiv?.click()"),
    主图像URLs选择器: import_koishi2.Schema.string().description("如果你不知道这是什么请不要动它！！！这个选择器是选择点击进入作品后寻找大图的，最后返回原图像的URLs数组").default("const urls = []; Array.from(document.querySelector('main section figure').querySelectorAll('img')).forEach(img => urls.push(img.src)); urls;")
  })
});
function apply(ctx2) {
  const pageOwner = {};
  activeControlledPageOwner = pageOwner;
  index_default4.preInit(ctx2);
  if (typeof ctx2.on === "function") {
    ctx2.on("dispose", async () => {
      await withControlledPageLock(() => releaseControlledPages(ctx2.puppeteer.browser, pageOwner));
    });
  }
  if (ctx2.config.ensureLogin === true) {
    index_default4.cycle(ctx2).catch((error) => {
      ctx2.logger.error(`Pixiv 页面初始化失败: ${error?.message || error}`);
    });
  } else {
    withControlledPageLock(() => releaseControlledPages(ctx2.puppeteer.browser, void 0, true)).catch((error) => {
      ctx2.logger.error(`清理 Pixiv 页面失败: ${error?.message || error}`);
    });
  }
  ctx2.command("随机涩图 [message:text]").usage("从p站的推荐作品中随机获取一张图片").action(async (av, ms) => {
    await index_default5.randomTJPic(av, ms);
  });
  ctx2.command("随机R18涩图 [message:text]").usage("从p站R18 Discovery页面随机获取推荐作品（需先开启R18设置）").action(async (av, ms) => {
    await index_default5.randomTJPic(av, ms, true);
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name,
  usage
});
