declare const Data: {
    baseData: {
        inintAllBaseData: (ctx: import("koishi").Context) => void;
        setLogger: (_: import("@cordisjs/logger").LoggerService) => void;
        initKoishiBaseDir: (dir: string) => void;
        initMyPluginDataDir: () => void;
        initMyBrowserUserDataDir: () => void;
        initPuppeteer: (ctx: import("koishi").Context) => void;
        setCTX: (ctx_: import("koishi").Context) => void;
        setCurPage: (p: import("puppeteer-core").Page) => void;
        setPixivNetHeader: (h: Record<string, string>) => void;
        setIpximgNetHeader: (h: Record<string, string>) => void;
        getLogger: () => import("@cordisjs/logger").LoggerService;
        getKoishiBaseDir: () => string;
        getMyPluginDataDir: () => string;
        getMyUserDataDir: () => string;
        getPuppeteer: () => import("koishi-plugin-puppeteer").default;
        getCTX: () => import("koishi").Context;
        getCurPage: () => import("puppeteer-core").Page;
        getPixivNetHeader: () => Record<string, string>;
        getIpximgNetHeader: () => Record<string, string>;
    };
};
export default Data;
