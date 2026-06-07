import { Context } from "koishi";
/**
 * 可被反复触发的事件 服务修改时->尝试获取新的puppeteer
 * 修改的全局资源: ctx, puppeteer, page, logger
 * @param ctx
 */
declare function cycle(ctx: Context): Promise<void>;
export default cycle;
