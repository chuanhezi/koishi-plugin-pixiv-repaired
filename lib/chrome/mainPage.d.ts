import { type Context } from "koishi";
/**
 * 运行页面初始化
 * 如果config指示未登录则不进行初始化
 */
declare function pupterBrowserInit(ctx: Context): Promise<void>;
declare function getRandomTJPic(): Promise<[Buffer[], string]>;
declare const browser: {
    pupterBrowserInit: typeof pupterBrowserInit;
    getRandomTJPic: typeof getRandomTJPic;
};
export default browser;
