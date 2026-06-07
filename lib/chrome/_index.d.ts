declare const chrome: {
    browser: {
        pupterBrowserInit: (ctx: import("koishi").Context) => Promise<void>;
        getRandomTJPic: () => Promise<[Buffer[], string]>;
    };
    waitFunc: {
        waitNav: (page: import("puppeteer-core").Page) => Promise<void>;
    };
    pageController: {
        getArtWorkInfo: typeof import("./pageController/getPixivArtworkInfo").default;
    };
};
export default chrome;
