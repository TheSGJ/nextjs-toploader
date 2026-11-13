const test = require('node:test');
const assert = require('node:assert');
const React = require('react');
const NProgress = require('nprogress');

// Setup mock DOM environment before loading NextTopLoader
const eventListeners = {
  document: {},
  window: {},
};

const mockHtmlElement = {
  classList: {
    remove: () => {},
  },
};

global.window = {
  location: {
    href: 'http://localhost:3000/dashboard',
  },
  history: {
    pushState: () => {},
    replaceState: () => {},
  },
  addEventListener: (event, handler) => {
    eventListeners.window[event] = eventListeners.window[event] || [];
    eventListeners.window[event].push(handler);
  },
  removeEventListener: (event, handler) => {
    if (eventListeners.window[event]) {
      eventListeners.window[event] = eventListeners.window[event].filter((h) => h !== handler);
    }
  },
};

global.document = {
  querySelectorAll: (selector) => {
    if (selector === 'html') {
      return [mockHtmlElement];
    }
    return [];
  },
  addEventListener: (event, handler) => {
    eventListeners.document[event] = eventListeners.document[event] || [];
    eventListeners.document[event].push(handler);
  },
  removeEventListener: (event, handler) => {
    if (eventListeners.document[event]) {
      eventListeners.document[event] = eventListeners.document[event].filter((h) => h !== handler);
    }
  },
};

// Spies for NProgress
const nprogressCalls = {
  start: 0,
  done: 0,
};

NProgress.start = () => {
  nprogressCalls.start++;
};
NProgress.done = () => {
  nprogressCalls.done++;
};
NProgress.configure = () => {};

// Intercept React.useEffect to manually trigger effect in tests
let capturedEffect = null;
React.useEffect = (effect) => {
  capturedEffect = effect;
};

// Load NextTopLoader from dist
const NextTopLoader = require('../dist/index.js').default;

function setupComponent(props = {}) {
  eventListeners.document = {};
  eventListeners.window = {};
  nprogressCalls.start = 0;
  nprogressCalls.done = 0;
  global.window.location.href = 'http://localhost:3000/dashboard';

  NextTopLoader(props);
  assert.ok(capturedEffect, 'useEffect was registered');
  const cleanup = capturedEffect();
  const handleClick = eventListeners.document.click?.[0];
  assert.ok(handleClick, 'document click listener was added');

  return { handleClick, cleanup };
}

function createClickEvent({
  href,
  target = '',
  hasDownload = false,
  download = '',
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  nested = false,
}) {
  const anchor = {
    tagName: 'A',
    href,
    target,
    hasAttribute: (attr) => attr === 'download' && hasDownload,
    getAttribute: (attr) => (attr === 'download' && hasDownload ? download : null),
    parentElement: null,
  };

  let targetElement = anchor;
  if (nested) {
    targetElement = {
      tagName: 'SPAN',
      parentElement: anchor,
    };
  }

  return {
    target: targetElement,
    ctrlKey,
    metaKey,
    shiftKey,
    altKey,
  };
}

test('normal navigation link triggers top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/profile' }));

  assert.strictEqual(nprogressCalls.start, 1, 'NProgress.start should be called once for navigation link');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called yet for navigation link');

  cleanup();
});

test('normal navigation link with nested elements triggers top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/settings', nested: true }));

  assert.strictEqual(nprogressCalls.start, 1, 'NProgress.start should be called for click on nested element');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called yet');

  cleanup();
});

test('download link with boolean download attribute does not trigger top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/document.pdf', hasDownload: true }));

  assert.strictEqual(nprogressCalls.start, 0, 'NProgress.start should not be called for download link');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called for download link');

  cleanup();
});

test('download link with named filename attribute does not trigger top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(
    createClickEvent({
      href: 'http://localhost:3000/export',
      hasDownload: true,
      download: 'export-2026.csv',
    })
  );

  assert.strictEqual(nprogressCalls.start, 0, 'NProgress.start should not be called for named download link');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called for named download link');

  cleanup();
});

test('download link with empty string download attribute does not trigger top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(
    createClickEvent({
      href: 'http://localhost:3000/download-file',
      hasDownload: true,
      download: '',
    })
  );

  assert.strictEqual(nprogressCalls.start, 0, 'NProgress.start should not be called for empty string download attribute');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called');

  cleanup();
});

test('download link with nested elements does not trigger top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(
    createClickEvent({
      href: 'http://localhost:3000/archive.zip',
      hasDownload: true,
      nested: true,
    })
  );

  assert.strictEqual(nprogressCalls.start, 0, 'NProgress.start should not be called for nested download link');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called for nested download link');

  cleanup();
});

test('cross-origin download link does not trigger top loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(
    createClickEvent({
      href: 'https://cdn.example.com/file.pdf',
      hasDownload: true,
    })
  );

  assert.strictEqual(nprogressCalls.start, 0, 'NProgress.start should not be called for cross-origin download');
  assert.strictEqual(nprogressCalls.done, 0, 'NProgress.done should not be called for cross-origin download');

  cleanup();
});

test('same URL link completes immediately without lingering loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/dashboard' }));

  assert.strictEqual(nprogressCalls.start, 1);
  assert.strictEqual(nprogressCalls.done, 1);

  cleanup();
});

test('target="_blank" link completes immediately without lingering loader', () => {
  const { handleClick, cleanup } = setupComponent();

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/docs', target: '_blank' }));

  assert.strictEqual(nprogressCalls.start, 1);
  assert.strictEqual(nprogressCalls.done, 1);

  cleanup();
});

test('modifier key clicks (ctrl/meta/alt/shift) complete immediately without lingering loader', () => {
  const { handleClick, cleanup } = setupComponent();

  // Ctrl key
  nprogressCalls.start = 0;
  nprogressCalls.done = 0;
  handleClick(createClickEvent({ href: 'http://localhost:3000/about', ctrlKey: true }));
  assert.strictEqual(nprogressCalls.start, 1);
  assert.strictEqual(nprogressCalls.done, 1);

  // Meta key
  nprogressCalls.start = 0;
  nprogressCalls.done = 0;
  handleClick(createClickEvent({ href: 'http://localhost:3000/about', metaKey: true }));
  assert.strictEqual(nprogressCalls.start, 1);
  assert.strictEqual(nprogressCalls.done, 1);

  cleanup();
});

test('hash anchor with showForHashAnchor=false does not trigger loader', () => {
  const { handleClick, cleanup } = setupComponent({ showForHashAnchor: false });

  nprogressCalls.start = 0;
  nprogressCalls.done = 0;

  handleClick(createClickEvent({ href: 'http://localhost:3000/dashboard#section' }));

  assert.strictEqual(nprogressCalls.start, 0);
  assert.strictEqual(nprogressCalls.done, 0);

  cleanup();
});

test('cleanup removes event listeners on unmount', () => {
  const { cleanup } = setupComponent();

  assert.strictEqual(eventListeners.document.click.length, 1);
  assert.strictEqual(eventListeners.window.pagehide.length, 1);
  assert.strictEqual(eventListeners.window.popstate.length, 1);

  cleanup();

  assert.strictEqual(eventListeners.document.click.length, 0);
  assert.strictEqual(eventListeners.window.pagehide.length, 0);
  assert.strictEqual(eventListeners.window.popstate.length, 0);
});
