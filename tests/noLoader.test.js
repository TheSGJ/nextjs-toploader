/**
 * Tests for Issue #142 — Allow Disabling the Loader for Specific Links (data-no-loader).
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');

function createDOM() {
  const listeners = {
    window: {},
    document: {},
  };

  class DOMElement {
    constructor(tagName, id = '', className = '') {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.className = className;
      this.attributes = {};
      this.children = [];
      this.parentNode = null;
      this.style = {};
      this.href = '';
      this.target = '';
    }

    get parentElement() {
      return this.parentNode;
    }

    setAttribute(name, value) {
      this.attributes[name] = String(value);
    }

    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    }

    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name);
    }

    removeAttribute(name) {
      delete this.attributes[name];
    }

    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    }
  }

  const html = new DOMElement('html');
  const body = new DOMElement('body');
  html.appendChild(body);

  const doc = {
    documentElement: html,
    body: body,
    createElement: (tag) => new DOMElement(tag),
    querySelectorAll: (sel) => {
      if (sel === 'html') return [html];
      return [];
    },
    addEventListener: (event, handler) => {
      listeners.document[event] = listeners.document[event] || [];
      listeners.document[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (listeners.document[event]) {
        listeners.document[event] = listeners.document[event].filter((h) => h !== handler);
      }
    },
  };

  const win = {
    location: {
      href: 'http://localhost:3000/home',
      hostname: 'localhost',
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    addEventListener: (event, handler) => {
      listeners.window[event] = listeners.window[event] || [];
      listeners.window[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (listeners.window[event]) {
        listeners.window[event] = listeners.window[event].filter((h) => h !== handler);
      }
    },
  };

  return { html, body, doc, win, listeners, DOMElement };
}

test('NextTopLoader: Normal link click triggers NProgress.start()', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  const NextTopLoader = require('../dist/index.js').default;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    NextTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = 'http://localhost:3000/dashboard';
    link.target = '';
    dom.body.appendChild(link);

    const clickHandler = dom.listeners.document['click'][0];
    assert.ok(clickHandler, 'Click listener should be registered');

    started = false;
    clickHandler({
      target: link,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
    });

    assert.equal(started, true, 'Normal link must trigger NProgress.start()');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});

test('NextTopLoader: Link with data-no-loader does NOT trigger NProgress.start()', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  const NextTopLoader = require('../dist/index.js').default;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    NextTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = 'http://localhost:3000/privacy';
    link.target = '';
    link.setAttribute('data-no-loader', '');
    dom.body.appendChild(link);

    const clickHandler = dom.listeners.document['click'][0];

    started = false;
    clickHandler({
      target: link,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
    });

    assert.equal(started, false, 'Link with data-no-loader must NOT trigger NProgress.start()');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});

test('NextTopLoader: Link with data-no-loader="true" does NOT trigger NProgress.start()', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  const NextTopLoader = require('../dist/index.js').default;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    NextTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = 'http://localhost:3000/terms';
    link.target = '';
    link.setAttribute('data-no-loader', 'true');
    dom.body.appendChild(link);

    const clickHandler = dom.listeners.document['click'][0];

    started = false;
    clickHandler({
      target: link,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
    });

    assert.equal(started, false, 'data-no-loader="true" must NOT trigger NProgress.start()');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});

test('NextTopLoader: Link with data-no-loader="false" DOES trigger NProgress.start()', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  const NextTopLoader = require('../dist/index.js').default;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    NextTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = 'http://localhost:3000/about';
    link.target = '';
    link.setAttribute('data-no-loader', 'false');
    dom.body.appendChild(link);

    const clickHandler = dom.listeners.document['click'][0];

    started = false;
    clickHandler({
      target: link,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
    });

    assert.equal(started, true, 'data-no-loader="false" should still trigger NProgress.start()');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});

test('NextTopLoader: Clicking nested child element inside data-no-loader link does NOT trigger loader', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  const NextTopLoader = require('../dist/index.js').default;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    NextTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = 'http://localhost:3000/settings';
    link.target = '';
    link.setAttribute('data-no-loader', '');
    dom.body.appendChild(link);

    const span = dom.doc.createElement('span');
    link.appendChild(span);

    const icon = dom.doc.createElement('svg');
    span.appendChild(icon);

    const path = dom.doc.createElement('path');
    icon.appendChild(path);

    const clickHandler = dom.listeners.document['click'][0];

    // Click deeply nested <path>
    started = false;
    clickHandler({
      target: path,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
    });

    assert.equal(started, false, 'Clicking child element inside data-no-loader link must NOT trigger loader');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});

test('PagesTopLoader: Clicking data-no-loader link skips routeChangeStart loader trigger', () => {
  const dom = createDOM();
  global.window = dom.win;
  global.document = dom.doc;

  const NProgress = require('nprogress');
  let started = false;
  const origStart = NProgress.start;
  NProgress.start = () => {
    started = true;
    return NProgress;
  };

  // Mock next/router Router.events
  const routerEvents = {};
  const mockRouter = {
    events: {
      on: (ev, fn) => { routerEvents[ev] = fn; },
      off: (ev) => { delete routerEvents[ev]; },
    },
  };
  require.cache[require.resolve('next/router')] = {
    exports: mockRouter,
  };

  const PagesTopLoader = require('../dist/pages.js').PagesTopLoader;

  let unmount;
  const originalUseEffect = React.useEffect;
  const originalUseRef = React.useRef;
  React.useEffect = (cb) => { unmount = cb(); };
  React.useRef = (val) => ({ current: val });

  try {
    PagesTopLoader({});

    const link = dom.doc.createElement('a');
    link.href = '/privacy';
    link.setAttribute('data-no-loader', '');
    dom.body.appendChild(link);

    // Simulate clicking data-no-loader link
    const clickHandler = dom.listeners.document['click'][0];
    assert.ok(clickHandler, 'Click listener should be registered on document in PagesTopLoader');
    clickHandler({ target: link });

    // Next.js emits routeChangeStart
    started = false;
    routerEvents['routeChangeStart']('/privacy');
    assert.equal(started, false, 'PagesTopLoader must skip NProgress.start() when data-no-loader link was clicked');

    // Subsequent normal navigation works
    started = false;
    routerEvents['routeChangeStart']('/dashboard');
    assert.equal(started, true, 'PagesTopLoader should start NProgress on subsequent normal route change');
  } finally {
    if (unmount) unmount();
    React.useEffect = originalUseEffect;
    React.useRef = originalUseRef;
    NProgress.start = origStart;
  }
});
