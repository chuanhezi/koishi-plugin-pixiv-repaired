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

// src/index.ts
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

// src/Data/baseData.ts
var import_path = __toESM(require("path"));
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

// src/Data/_index.ts
var Data = {
  baseData: baseData_default
};
var index_default = Data;

// src/Event/preInit.ts
var started = false;
async function preInit(ctx2) {
  if (started) return;
  index_default.baseData.inintAllBaseData(ctx2);
  started = true;
}
__name(preInit, "preInit");
var preInit_default = preInit;

// src/chrome/mainPage.ts
var import_axios = __toESM(require("axios"));
var import_koishi = require("koishi");
async function pupterBrowserInit(ctx2) {
  const logger2 = ctx2.logger;
  if (ctx2.config.ensureLogin === false) {
    logger2.warn("当前状态为未登录，将不会进行页面初始化");
    return;
  }
  const puppeteer2 = index_default.baseData.getPuppeteer();
  const pages = await puppeteer2.browser.pages();
  let myPage;
  for (const page of pages) {
    if (page.url() === "about:blank" || page.url().includes("pixiv.net")) {
      myPage = page;
      break;
    }
  }
  if (!myPage) {
    myPage = await puppeteer2.browser.newPage();
    await myPage.goto("https://www.pixiv.net/");
  }
  await myPage.bringToFront();
  await myPage.goto("https://www.pixiv.net/");
  await myPage.setRequestInterception(true);
  myPage.on("request", (request) => {
    const domain = new URL(request.url()).hostname;
    if (domain === "www.pixiv.net") {
      let header = index_default.baseData.getPixivNetHeader() || {};
      header = {
        ...header,
        ...request.headers()
      };
      index_default.baseData.setPixivNetHeader(header);
    } else if (domain === "i.pximg.net") {
      let header = index_default.baseData.getIpximgNetHeader() || {};
      header = {
        ...header,
        ...request.headers()
      };
      index_default.baseData.setIpximgNetHeader(header);
    }
    request.continue();
  });
  baseData_default.setCurPage(myPage);
}
__name(pupterBrowserInit, "pupterBrowserInit");
async function getRandomTJPic(isR18 = false) {
  const logger2 = index_default.baseData.getLogger();
  const page = baseData_default.getCurPage();
  const config2 = index_default.baseData.getCTX().config;
  const targetURL = isR18 ? "https://www.pixiv.net/discovery?mode=r18" : "https://www.pixiv.net/discovery";
  const urlSelector = isR18 ? config2.HTMLSelector.R18排行URLs选择器 : config2.HTMLSelector.推荐作品URLs选择器;
  const sectionLabel = isR18 ? "R18排行榜" : "推荐作品";
  try {
    logger2.info(`正在查找${sectionLabel}`);
    await page.bringToFront();
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
    try {
      await imgElement.click();
    } catch (e) {
      logger2.warn("打开作品时发生错误:", e);
    }
    logger2.info("等待网页跳转完成，并且等待选择器找到");
    try {
      await index_default2.waitFunc.waitNav(page);
      logger2.info(`等待网页跳转完成: ${config2.等待NAV超时时间}ms`);
      await page.waitForSelector("main section figure img");
      logger2.info("选择器找到，开始解析图片URL");
    } catch (error) {
      logger2.warn(`等待超时，尝试跳过等待继续执行逻辑: ${error}`);
    }
    logger2.info("等待图片加载已结束");
    const artInfo = await index_default2.pageController.getArtWorkInfo(page);
    try {
      await page.evaluate(config2.HTMLSelector.主图像查看全部按钮选择点击);
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
    logger2.info(isR18 ? "正在返回R18排行榜" : "正在返回主页");
    await page.goto(targetURL);
    index_default.baseData.setCurPage(page);
  }
}
__name(getRandomTJPic, "getRandomTJPic");
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
  let imgPage;
  try {
    imgPage = await puppeteer2.browser.newPage();
    await imgPage.setExtraHTTPHeaders({ referer: "https://www.pixiv.net/" });
    const bufferPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("下载超时")), 30e3);
      imgPage.once("response", async (response) => {
        clearTimeout(timeout);
        try {
          resolve(await response.buffer());
        } catch (e) {
          reject(e);
        }
      });
    });
    await imgPage.goto(picUrl, { waitUntil: "load", timeout: 30e3 });
    const buffer = await bufferPromise;
    logger2.info("图片下载成功");
    return buffer;
  } catch (error) {
    logger2.error(`下载图片时发生错误: `);
    logger2.error(error);
    throw error;
  } finally {
    if (imgPage) {
      try { await imgPage.close(); } catch (_) {}
    }
  }
}
__name(downloadPixivImg, "downloadPixivImg");

// src/chrome/waitFunc.ts
async function waitNav(page) {
  await page.waitForNavigation({ timeout: index_default.baseData.getCTX().config.等待NAV超时时间 });
}
__name(waitNav, "waitNav");
var waitFunc = {
  waitNav
};
var waitFunc_default = waitFunc;

// src/chrome/pageController/getPixivArtworkInfo.ts
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
副标题: ${title1}
tags: ${tagString.join(" ")}
喜欢数: ${likeCount}
收藏数: ${collectionCount}
浏览数: ${viewCount}
时间: ${time}`;
      } else {
        return `作品名称: 无
作者: ${authorName} 作者ID: ${authorNumber}
副标题: 无
tags: ${tagString.join(" ")}
喜欢数: ${likeCount}
收藏数: ${collectionCount}
浏览数: ${viewCount}
时间: ${time}`;
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

// src/chrome/pageController/_index.ts
var pageController = {
  getArtWorkInfo: getPixivArtworkInfo_default
};
var index_default3 = pageController;

// src/chrome/_index.ts
var chrome = {
  browser: mainPage_default,
  waitFunc: waitFunc_default,
  pageController: index_default3
};
var index_default2 = chrome;

// src/Event/init.ts
function init(ctx2) {
  index_default2.browser.pupterBrowserInit(ctx2);
}
__name(init, "init");
var init_default = init;

// src/Event/cir.ts
async function cycle(ctx2) {
  if (!started) {
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
__name(cycle, "cycle");
var cir_default = cycle;
async function selectSuitablePage() {
  const logger2 = index_default.baseData.getLogger();
  const pages = await index_default.baseData.getPuppeteer().browser.pages();
  let myPage;
  for (const page of pages) {
    if (page.url() === "about:blank" || page.url().includes("pixiv.net")) {
      myPage = page;
      try {
        await myPage.goto("https://www.pixiv.net/");
      } catch (e) {
        logger2.warn(`页面导航到pixiv失败: ${e}`);
      }
      break;
    }
  }
  if (myPage === void 0) {
    myPage = await index_default.baseData.getPuppeteer().browser.newPage();
  }
  logger2.info(`page设置完毕: ${myPage.url()}`);
  index_default.baseData.setCurPage(myPage);
}
__name(selectSuitablePage, "selectSuitablePage");

// src/Event/_index.ts
var Event = {
  preInit: preInit_default,
  init: init_default,
  cycle: cir_default
};
var index_default4 = Event;

// src/command/randomPic.tsx
var import_jsx_runtime = require("@satorijs/element/jsx-runtime");
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
      message.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: "data:image/png;base64," + pic.toString("base64") }));
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

// src/command/_index.ts
var commands = {
  randomTJPic: randomPic_default
};
var index_default5 = commands;

// src/index.ts
var name = "pixiv";
var usage = "第一次使用本插件时请在puppeteer服务中设置args: `--user-data-dir=/path/to/custom-profile-dir` 否则无法记录登录信息\n\n本插件没有使用反代站点，直接操作pixiv网站，所以需要能访问国外网络，在puppeteer服务中添加args `--proxy-server=127.0.0.1:<端口>`\n\n且强烈推荐关闭无头模式，因为插件可能会打开很多页面，如果你开了无头模式可能会不知不觉吃掉很多内存和性能，关掉无头随时查看浏览器\n\n使用 `随机涩图` 即可随机获取一张p站推荐作品中的图片~~~\n\n使用 `随机R18涩图` 即可随机获取一张p站R18排行榜中的图片（需先在pixiv设置中开启R18显示）";
var inject = {
  required: ["puppeteer"]
};
var Config = import_koishi2.Schema.object({
  // excutePath: Schema.string().description("puppeteer的chrome路径或者chromium路径").required(),
  ensureLogin: import_koishi2.Schema.boolean().description("请在确认登录过pixiv后再打开此开关!").default(false),
  等待NAV超时时间: import_koishi2.Schema.number().description("等待NAV超时时间，单位ms").default(15e3),
  HTMLSelector: import_koishi2.Schema.object({
    推荐作品URLs选择器: import_koishi2.Schema.string().description("推荐/发现页面的图片选择器，返回所有作品缩略图URLs数组。可在浏览器控制台调试修改").default("(() => {const urls = [];const imgs = document.querySelectorAll('img[src*=\"i.pximg.net\"]');for (const img of imgs) {if (img.naturalWidth > 100 && img.src.includes('/c/')) {urls.push(img.src);}}if (urls.length === 0) {document.querySelectorAll('img[src*=\"i.pximg.net\"]').forEach(img => urls.push(img.src));}return urls;})()"),
    R18排行URLs选择器: import_koishi2.Schema.string().description("R18排行榜的图片选择器，返回目标图片urls数组。可在浏览器控制台调试修改").default("(() => {const urls = [];const imgs = document.querySelectorAll('img[src*=\"i.pximg.net\"]');for (const img of imgs) {if (img.naturalWidth > 100 && img.src.includes('/c/')) {urls.push(img.src);}}if (urls.length === 0) {document.querySelectorAll('img[src*=\"i.pximg.net\"]').forEach(img => urls.push(img.src));}return urls;})()"),
    主图像查看全部按钮选择点击: import_koishi2.Schema.string().description("如果你不知道这是什么请不要动它！！！这个选择器是尝试找查看全部按钮然后展开全部作品，方便获取所有图片").default("const buttonsDivs = Array.from(document.querySelectorAll(`main button div`));const lookAllDiv = buttonsDivs.find(div => div.textContent.includes(`查看全部`));lookAllDiv.click()"),
    主图像URLs选择器: import_koishi2.Schema.string().description("如果你不知道这是什么请不要动它！！！这个选择器是选择点击进入作品后寻找大图的，最后返回原图像的URLs数组").default("const urls = []; Array.from(document.querySelector('main section figure').querySelectorAll('img')).forEach(img => urls.push(img.src)); urls;")
  })
});
function apply(ctx2) {
  index_default4.preInit(ctx2);
  index_default4.init(ctx2);
  index_default4.cycle(ctx2);
  ctx2.command("随机涩图 [message:text]").usage("从p站的推荐作品中随机获取一张图片").action(async (av, ms) => {
    await index_default5.randomTJPic(av, ms);
  });
  ctx2.command("随机R18涩图 [message:text]").usage("从p站的R18日榜中随机获取一张图片（需先开启R18设置）").action(async (av, ms) => {
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
