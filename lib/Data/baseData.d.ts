import type { Context } from "koishi";
import * as cjl from "@cordisjs/logger";
import p__ from 'koishi-plugin-puppeteer';
import * as p_ from 'puppeteer-core';
/**
 * 预初始化 logger KoishiData目录 插件数据目录 浏览器UserDataDir  puppeteer
 * @param ctx
 */
declare function inintAllBaseData(ctx: Context): void;
declare function setLogger(_: cjl.LoggerService): void;
declare function getLogger(): cjl.LoggerService;
declare function getKoishiBaseDir(): string;
declare function initKoishiBaseDir(dir: string): void;
declare function getMyPluginDataDir(): string;
declare function initMyPluginDataDir(): void;
declare function initMyBrowserUserDataDir(): void;
declare function getMyUserDataDir(): string;
declare function getPuppeteer(): p__;
declare function initPuppeteer(ctx: Context): void;
declare function setCTX(ctx_: Context): void;
declare function getCTX(): Context;
/**
 * 操作页面时，当函数结束记得调用此函数，将页面存入全局变量中
 * @param p
 */
declare function setCurPage(p: p_.Page): void;
declare function getCurPage(): p_.Page;
declare function setPixivNetHeader(h: Record<string, string>): void;
declare function getPixivNetHeader(): Record<string, string>;
declare function setIpximgNetHeader(h: Record<string, string>): void;
declare function getIpximgNetHeader(): Record<string, string>;
declare const baseData: {
    inintAllBaseData: typeof inintAllBaseData;
    setLogger: typeof setLogger;
    initKoishiBaseDir: typeof initKoishiBaseDir;
    initMyPluginDataDir: typeof initMyPluginDataDir;
    initMyBrowserUserDataDir: typeof initMyBrowserUserDataDir;
    initPuppeteer: typeof initPuppeteer;
    setCTX: typeof setCTX;
    setCurPage: typeof setCurPage;
    setPixivNetHeader: typeof setPixivNetHeader;
    setIpximgNetHeader: typeof setIpximgNetHeader;
    getLogger: typeof getLogger;
    getKoishiBaseDir: typeof getKoishiBaseDir;
    getMyPluginDataDir: typeof getMyPluginDataDir;
    getMyUserDataDir: typeof getMyUserDataDir;
    getPuppeteer: typeof getPuppeteer;
    getCTX: typeof getCTX;
    getCurPage: typeof getCurPage;
    getPixivNetHeader: typeof getPixivNetHeader;
    getIpximgNetHeader: typeof getIpximgNetHeader;
};
export default baseData;
