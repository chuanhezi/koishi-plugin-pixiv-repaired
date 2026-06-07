import * as p_ from 'puppeteer-core';
declare function waitNav(page: p_.Page): Promise<void>;
declare const waitFunc: {
    waitNav: typeof waitNav;
};
export default waitFunc;
