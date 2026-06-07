import * as p_ from 'puppeteer-core';
/**
 * 注意!请在进入artwork页面后再调用本函数
 * @param p
 * @returns
 */
declare function getArtWorkInfo(p: p_.Page): Promise<string>;
export default getArtWorkInfo;
