const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const { fileURLToPath } = require('node:url');

const pluginPath = path.resolve(__dirname, '../lib/index.js');

function createSchema() {
  return {
    collapse() { return this; },
    default() { return this; },
    description() { return this; },
    max() { return this; },
    min() { return this; },
    step() { return this; },
  };
}

function loadPlugin() {
  const originalLoad = Module._load;
  Module._load = function load(request, parent, isMain) {
    if (request === 'koishi') {
      return {
        Schema: {
          boolean: createSchema,
          number: createSchema,
          object: createSchema,
          string: createSchema,
        },
      };
    }
    if (request === 'axios') return {};
    if (request === '@satorijs/element/jsx-runtime') {
      return {
        Fragment: 'fragment',
        jsx: (type, props) => ({ type, props }),
        jsxs: (type, props) => ({ type, props }),
      };
    }
    return originalLoad(request, parent, isMain);
  };

  try {
    delete require.cache[pluginPath];
    return require(pluginPath);
  } finally {
    Module._load = originalLoad;
  }
}

class FakePage {
  constructor(url = 'about:blank') {
    this.closeCalls = 0;
    this.closed = false;
    this.currentUrl = url;
    this.gotoCalls = 0;
    this.interceptionCalls = 0;
    this.listeners = new Map();
  }

  async bringToFront() {}

  async close() {
    this.closeCalls += 1;
    this.closed = true;
  }

  async goto(url) {
    this.gotoCalls += 1;
    this.currentUrl = url;
  }

  listenerCount(event) {
    return this.listeners.get(event)?.size || 0;
  }

  isClosed() {
    return this.closed;
  }

  off(event, handler) {
    this.listeners.get(event)?.delete(handler);
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
  }

  async setRequestInterception() {
    this.interceptionCalls += 1;
  }

  url() {
    return this.currentUrl;
  }
}

class ArtworkPage extends FakePage {
  constructor(imageURLs = []) {
    super();
    this.clickCalls = 0;
    this.imageURLs = imageURLs;
    this.stableWaitCalls = 0;
    this.waitRegisteredBeforeClick = false;
  }

  async $(selector) {
    assert.match(selector, /^img\[src=/);
    return {
      click: async () => {
        this.clickCalls += 1;
        this.currentUrl = 'https://www.pixiv.net/artworks/123';
      },
    };
  }

  async evaluate(script) {
    if (script === 'thumbnail-selector') return ['https://i.pximg.net/thumbnail.jpg'];
    if (script === 'expand-selector') return undefined;
    if (script === 'url-selector') return this.imageURLs;
    const source = String(script);
    if (source.includes('timeoutMs')) {
      this.stableWaitCalls += 1;
      return undefined;
    }
    if (source.includes('authorSection')) return '作品信息';
    return undefined;
  }

  async waitForFunction() {
    this.waitRegisteredBeforeClick = this.clickCalls === 0;
  }

  async waitForSelector() {}
}

class DownloadPage extends FakePage {
  async goto(url) {
    await super.goto(url);
    return {
      buffer: async () => Buffer.from([0xff, 0xd8, 0xff, 0x00]),
      ok: () => true,
    };
  }

  async setExtraHTTPHeaders() {}
}

function createBrowser(initialPages = [], pageFactory = () => new FakePage()) {
  return {
    createdPages: [],
    newPageCalls: 0,
    pageList: [...initialPages],
    pagesCalls: 0,
    async newPage() {
      this.newPageCalls += 1;
      const page = pageFactory();
      this.createdPages.push(page);
      this.pageList.push(page);
      return page;
    },
    async pages() {
      this.pagesCalls += 1;
      return this.pageList.filter((page) => !page.isClosed());
    },
  };
}

function createContext(ensureLogin, browser = createBrowser()) {
  const actions = new Map();
  const disposers = [];
  const logger = {
    error() {},
    info() {},
    warn() {},
  };
  const ctx = {
    actions,
    baseDir: process.cwd(),
    config: {
      ensureLogin,
      等待NAV超时时间: 50,
      HTMLSelector: {
        推荐作品URLs选择器: 'thumbnail-selector',
        R18排行URLs选择器: 'thumbnail-selector',
        主图像查看全部按钮选择点击: 'expand-selector',
        主图像URLs选择器: 'url-selector',
      },
    },
    logger,
    puppeteer: { browser },
    on(event, handler) {
      if (event === 'dispose') disposers.push(handler);
    },
    command(name) {
      const command = {
        action(handler) {
          actions.set(name, handler);
          return command;
        },
        usage() { return command; },
      };
      return command;
    },
  };
  return { actions, browser, ctx, disposers };
}

async function waitFor(predicate, timeout = 1_000) {
  const deadline = Date.now() + timeout;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error('Timed out waiting for condition');
    await new Promise((resolve) => setImmediate(resolve));
  }
}

test('ensureLogin must be explicitly enabled before browser access', async () => {
  for (const ensureLogin of [false, undefined]) {
    const plugin = loadPlugin();
    const { actions, browser, ctx } = createContext(ensureLogin);
    plugin.apply(ctx);

    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(browser.newPageCalls, 0);

    const messages = [];
    const action = actions.get('随机R18涩图 [message:text]');
    await action({ session: { messageId: '1', send: async (message) => messages.push(message) } }, '');

    assert.equal(browser.newPageCalls, 0);
    assert.match(JSON.stringify(messages), /ensureLogin/);
  }
});

test('page initialization and module reload keep one request handler', async () => {
  const userPage = new FakePage('https://www.pixiv.net/artworks/999');
  const browser = createBrowser([userPage]);
  const fixture = createContext(true, browser);
  loadPlugin().apply(fixture.ctx);
  await waitFor(() => browser.createdPages[0]?.gotoCalls === 1);
  const controlledPage = browser.createdPages[0];
  assert.equal(userPage.gotoCalls, 0);
  assert.equal(controlledPage.listenerCount('request'), 1);

  const reloaded = createContext(true, browser);
  loadPlugin().apply(reloaded.ctx);
  await waitFor(() => controlledPage.gotoCalls === 2);
  assert.equal(browser.newPageCalls, 1);
  assert.equal(controlledPage.listenerCount('request'), 1);

  await fixture.disposers[0]();
  assert.equal(controlledPage.closeCalls, 0);

  let continueCalls = 0;
  const [handler] = controlledPage.listeners.get('request');
  await handler({
    continue: async () => { continueCalls += 1; },
    headers: () => ({ referer: 'https://www.pixiv.net/' }),
    isInterceptResolutionHandled: () => false,
    url: () => 'https://i.pximg.net/example.jpg',
  });
  assert.equal(continueCalls, 1);

  await reloaded.disposers[0]();
  assert.equal(controlledPage.closeCalls, 1);
  assert.equal(controlledPage.listenerCount('request'), 0);
});

test('switching ensureLogin from true to false closes the owned page and refreshes config', async () => {
  const browser = createBrowser();
  const plugin = loadPlugin();
  const enabled = createContext(true, browser);
  plugin.apply(enabled.ctx);
  await waitFor(() => browser.createdPages[0]?.gotoCalls === 1);
  const controlledPage = browser.createdPages[0];

  const disabled = createContext(false, browser);
  plugin.apply(disabled.ctx);
  await waitFor(() => controlledPage.closeCalls === 1);

  const messages = [];
  const action = disabled.actions.get('随机涩图 [message:text]');
  await action({ session: { messageId: '2', send: async (message) => messages.push(message) } }, '');
  assert.equal(browser.newPageCalls, 1);
  assert.match(JSON.stringify(messages), /ensureLogin/);
});

test('artwork URL wait is registered before click and expanded images are stabilized', async () => {
  const browser = createBrowser([], () => new ArtworkPage());
  const fixture = createContext(true, browser);
  loadPlugin().apply(fixture.ctx);
  await waitFor(() => browser.createdPages[0]?.gotoCalls === 1);
  const controlledPage = browser.createdPages[0];

  const action = fixture.actions.get('随机涩图 [message:text]');
  await action({ session: { messageId: '3', send: async () => {} } }, '');

  assert.equal(controlledPage.clickCalls, 1);
  assert.equal(controlledPage.waitRegisteredBeforeClick, true);
  assert.equal(controlledPage.stableWaitCalls, 1);
});

test('image send falls back to a data URI and still sends artwork information', async () => {
  let pageCount = 0;
  const browser = createBrowser([], () => {
    pageCount += 1;
    return pageCount === 1
      ? new ArtworkPage(['https://i.pximg.net/original.jpg'])
      : new DownloadPage();
  });
  const fixture = createContext(true, browser);
  loadPlugin().apply(fixture.ctx);
  await waitFor(() => browser.createdPages[0]?.gotoCalls === 1);

  const sent = [];
  const action = fixture.actions.get('随机涩图 [message:text]');
  await action({
    session: {
      messageId: '4',
      send: async (message) => {
        sent.push(message);
        if (message.type === 'img' && message.props.src.startsWith('file:')) {
          throw new Error('OneBot rejected local file');
        }
      },
    },
  }, '');

  const fileMessage = sent.find((message) => message.type === 'img' && message.props.src.startsWith('file:'));
  const dataMessage = sent.find((message) => message.type === 'img' && message.props.src.startsWith('data:image/jpeg;base64,'));
  assert.ok(fileMessage);
  assert.ok(dataMessage);
  assert.equal(fs.existsSync(fileURLToPath(fileMessage.props.src)), false);
  assert.match(sent.at(-1), /作品信息/);
});
