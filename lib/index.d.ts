import { Context, Schema } from "koishi";

export declare const name = "pixiv";

export declare const usage: string;

export declare const inject: {
    required: string[];
};

/** 基本设置 */
interface BaseConfig {
    /** 登录状态 — 确认已在浏览器中登录 Pixiv 后开启 */
    ensureLogin: boolean;
    /** 页面加载与导航的最大等待时间（毫秒） */
    等待NAV超时时间: number;
}

/** 高级设置 — HTML 选择器配置 */
interface AdvancedConfig {
    HTMLSelector: {
        /** Discovery 推荐页面的图片选择器 */
        推荐作品URLs选择器: string;
        /** R18 Discovery 页面的推荐作品图片选择器 */
        R18排行URLs选择器: string;
        /** 点击"查看全部"按钮的 JS 代码 */
        主图像查看全部按钮选择点击: string;
        /** 作品详情页原图 URL 提取 JS 代码 */
        主图像URLs选择器: string;
    };
}

export type Config = BaseConfig & AdvancedConfig;

export declare const Config: Schema<Config>;

export declare function apply(ctx: Context): void;
