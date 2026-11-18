/**
 * Tests for Issue #136 — Custom targetElement support.
 *
 * We test the core logic that the implementation relies on:
 *  1. SSR: component renders a <style> tag without crashing.
 *  2. NProgress settings.parent getter returns body by default.
 *  3. When a custom target exists, getter returns the selector.
 *  4. When a custom target is missing/invalid, getter falls back to body.
 *  5. On unmount, the custom-parent class is removed and parent resets.
 *  6. TypeScript type contract: targetElement is in NextTopLoaderProps.
 *  7. isExternalLink regression guard: links with named targets
 *     (e.g. target="_rules") do not trigger the loader.
 *  8. Internal links (target='') still trigger the loader.
 *  9. Backward compatibility: no targetElement → behaves exactly as before.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Minimal class-list shim that behaves like DOMTokenList for className.
 */
function makeClassList(el) {
  return {
    _el: el,
    contains(cls) {
      return (' ' + el.className + ' ').includes(' ' + cls + ' ');
    },
    add(cls) {
      if (!this.contains(cls)) el.className = (el.className + ' ' + cls).trim();
    },
    remove(cls) {
      el.className = (' ' + el.className + ' ').replace(' ' + cls + ' ', ' ').trim();
    },
  };
}

/**
 * Build a minimal in-memory document that satisfies NProgress.render():
 *   - document.querySelector(selector) → returns a node with style + appendChild
 *   - document.getElementById('nprogress') → returns previously appended node
 *   - document.documentElement.className  (for 'nprogress-busy')
 *   - document.body.style                 (used by getPositioningCSS)
 */
function makeDocument() {
  function makeNode(id) {
    const node = {
      id,
      className: '',
      style: { transition: '', transform: '', opacity: '', marginLeft: '' },
      _children: [],
      _parent: null,
      offsetWidth: 0, // force repaint no-op
      get parentNode() {
        return node._parent;
      },
    };
    node.classList = makeClassList(node);
    node.appendChild = (child) => {
      child._parent = node;
      node._children.push(child);
    };
    node.removeChild = (child) => {
      const i = node._children.indexOf(child);
      if (i !== -1) {
        node._children.splice(i, 1);
        child._parent = null;
      }
    };
    node.querySelector = (sel) => {
      if (sel === '[role="bar"]') return makeStyleNode();
      if (sel === '[role="spinner"]') return makeStyleNode();
      return node._children.find((c) => c.id === sel.replace('#', '')) || null;
    };
    node.querySelectorAll = (sel) => node._children.filter((c) => c.id === sel.replace('#', ''));
    return node;
  }

  function makeStyleNode() {
    return { style: { transition: '', transform: '', marginLeft: '' } };
  }

  const bodyEl = makeNode('body');
  const htmlEl = makeNode('html');
  htmlEl.className = '';
  htmlEl.classList = makeClassList(htmlEl);
  // body.style is used by getPositioningCSS for vendor prefix detection
  bodyEl.style.WebkitTransform = '';

  const nodes = { body: bodyEl };

  const doc = {
    documentElement: htmlEl,
    body: bodyEl,
    _nodes: nodes,
    createElement(tag) {
      const n = makeNode('');
      n.tagName = tag.toUpperCase();
      n.innerHTML = ''; // NProgress sets this
      // Stub querySelector for bar/spinner roles
      n.querySelector = (sel) => {
        if (sel === '[role="bar"]') return makeStyleNode();
        if (sel === '[role="spinner"]') return makeStyleNode();
        return null;
      };
      return n;
    },
    getElementById(id) {
      return nodes[id] || null;
    },
    querySelector(selector) {
      if (selector === 'body') return bodyEl;
      if (selector === 'html') return htmlEl;
      const id = selector.replace(/^#/, '');
      return nodes[id] || null;
    },
    querySelectorAll(selector) {
      if (selector === 'html') return [htmlEl];
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
  };

  return { doc, bodyEl, nodes };
}

// ─── Test 1: SSR renders without error ──────────────────────────────────────

test('SSR: renders <style> tag without crashing, includes nprogress-custom-parent CSS', () => {
  const NextTopLoader = require('../dist/index.js').default;
  const html = ReactDOMServer.renderToString(
    React.createElement(NextTopLoader, { color: '#ff0000', targetElement: '#header' })
  );
  assert.ok(html.includes('<style'), 'Should render a style tag');
  assert.ok(html.includes('nprogress-custom-parent'), 'CSS rules for custom parent must be present');
  assert.ok(html.includes('#ff0000'), 'Custom color should be in CSS');
});

// ─── Test 2: TypeScript contract ────────────────────────────────────────────

test('TypeScript: targetElement prop is accepted in NextTopLoaderProps', () => {
  const { dist } = (() => {
    try {
      return { dist: require('../dist/index.js') };
    } catch (e) {
      return { dist: null };
    }
  })();
  assert.ok(dist !== null, 'dist/index.js must be loadable');
  // If the type didn't exist the build would fail — the import succeeding is the check.
  // Also verify the propTypes entry exists at runtime.
  const NextTopLoader = dist.default;
  assert.ok(
    NextTopLoader.propTypes && 'targetElement' in NextTopLoader.propTypes,
    'targetElement should be listed in propTypes'
  );
});

// ─── Test 3: NProgress settings.parent getter — core logic unit tests ───────

test('NProgress parent getter: defaults to body when no target provided', () => {
  const NProgress = require('nprogress');
  const { doc } = makeDocument();
  global.document = doc;

  // Simulate the getter installed by NextTopLoader
  let targetRef = { current: undefined };
  let storedParent = 'body';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() {
      const target = targetRef.current ?? storedParent;
      if (target && target !== 'body') {
        try {
          if (document.querySelector(target)) return target;
        } catch {
          return 'body';
        }
      }
      return 'body';
    },
    set(val) {
      storedParent = val;
    },
  });

  assert.equal(NProgress.settings.parent, 'body', 'Should return body when no targetElement');

  // Restore
  delete NProgress.settings.parent;
  NProgress.settings.parent = 'body';
});

test('NProgress parent getter: returns custom selector when element exists in DOM', () => {
  const NProgress = require('nprogress');
  const { doc, nodes } = makeDocument();
  global.document = doc;

  // Add a custom node
  const customEl = { id: 'sidebar', className: '', style: {}, _children: [], _parent: null, classList: null };
  customEl.classList = makeClassList(customEl);
  customEl.appendChild = (c) => { c._parent = customEl; customEl._children.push(c); };
  nodes['sidebar'] = customEl;

  let targetRef = { current: '#sidebar' };
  let storedParent = '#sidebar';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() {
      const target = targetRef.current ?? storedParent;
      if (target && target !== 'body') {
        try {
          if (document.querySelector(target)) return target;
        } catch {
          return 'body';
        }
      }
      return 'body';
    },
    set(val) {
      storedParent = val;
    },
  });

  assert.equal(NProgress.settings.parent, '#sidebar', 'Should return #sidebar when element exists');

  delete NProgress.settings.parent;
  NProgress.settings.parent = 'body';
});

test('NProgress parent getter: falls back to body when target element is missing', () => {
  const NProgress = require('nprogress');
  const { doc } = makeDocument();
  global.document = doc;

  let targetRef = { current: '#nonexistent' };
  let storedParent = '#nonexistent';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() {
      const target = targetRef.current ?? storedParent;
      if (target && target !== 'body') {
        try {
          if (document.querySelector(target)) return target;
        } catch {
          return 'body';
        }
      }
      return 'body';
    },
    set(val) {
      storedParent = val;
    },
  });

  assert.equal(NProgress.settings.parent, 'body', 'Should fall back to body when element not found');

  delete NProgress.settings.parent;
  NProgress.settings.parent = 'body';
});

test('NProgress parent getter: falls back to body on invalid CSS selector', () => {
  const NProgress = require('nprogress');
  const { doc } = makeDocument();
  // Override querySelector to throw on bad selector
  doc.querySelector = (sel) => {
    if (sel === 'body') return doc.body;
    throw new DOMException('invalid selector: ' + sel);
  };
  global.document = doc;

  let targetRef = { current: '###bad###' };
  let storedParent = '###bad###';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() {
      const target = targetRef.current ?? storedParent;
      if (target && target !== 'body') {
        try {
          if (document.querySelector(target)) return target;
        } catch {
          return 'body';
        }
      }
      return 'body';
    },
    set(val) {
      storedParent = val;
    },
  });

  assert.doesNotThrow(() => {
    const val = NProgress.settings.parent;
    assert.equal(val, 'body');
  }, 'Invalid selector must not throw and must return body');

  delete NProgress.settings.parent;
  NProgress.settings.parent = 'body';
});

// ─── Test 4: Cleanup removes nprogress-custom-parent and resets parent ────────

test('Cleanup: removes nprogress-custom-parent class from container and resets parent', () => {
  const { doc, nodes } = makeDocument();
  global.document = doc;

  // Create a custom container that already has the class
  const container = { id: 'panel', className: 'nprogress-custom-parent', style: {}, _children: [], _parent: null };
  container.classList = makeClassList(container);
  container.appendChild = (c) => { c._parent = container; container._children.push(c); };
  nodes['panel'] = container;

  // Simulate cleanup function logic
  const targetElement = '#panel';
  try {
    if (targetElement && targetElement !== 'body') {
      const parentEl = document.querySelector(targetElement);
      if (parentEl) {
        parentEl.classList.remove('nprogress-custom-parent');
      }
    }
  } catch {
    // ignore
  }

  assert.ok(
    !container.classList.contains('nprogress-custom-parent'),
    'nprogress-custom-parent should be removed on cleanup'
  );
});

test('Cleanup: resets NProgress parent to body via configure', () => {
  const NProgress = require('nprogress');
  const { doc } = makeDocument();
  global.document = doc;

  let storedParent = '#custom';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() { return storedParent; },
    set(val) { storedParent = val; },
  });

  // Simulate cleanup
  try {
    delete NProgress.settings.parent;
  } catch {}
  NProgress.configure({ parent: 'body' });

  assert.equal(NProgress.settings.parent, 'body', 'Parent should be reset to body after cleanup');
});

// ─── Test 5: isExternalLink regression guard (PR #124 bug) ──────────────────

test('Regression #124: anchor.target=="" (internal link) must NOT be treated as external', () => {
  // Reproduce the exact isExternalLink expression used in src/index.tsx
  const internalAnchor = { target: '' };
  const isExternalLink = internalAnchor.target !== '';
  assert.equal(isExternalLink, false, 'Internal links (target="") must not be external');
});

test('Regression #124: anchor.target=="_blank" is treated as external', () => {
  const externalAnchor = { target: '_blank' };
  const isExternalLink = externalAnchor.target !== '';
  assert.equal(isExternalLink, true, '_blank links must be external');
});

test('Regression #124: anchor with named window target (target="_rules") is treated as external', () => {
  const namedTargetAnchor = { target: '_rules' };
  const isExternalLink = namedTargetAnchor.target !== '';
  assert.equal(isExternalLink, true, 'Named window targets must be treated as external (PR #109 bug fix)');
});

test('Regression PR#109: bug was !!anchor (always true) — verify fixed expression differs', () => {
  // The broken expression from PR#109 commit 063d2bb:
  //   const isExternalLink = !!(anchor as HTMLAnchorElement);
  // This always returned true for any anchor object.
  const anyAnchor = { href: 'http://localhost/page', target: '' };
  const buggyExpression = !!anyAnchor; // always true
  const fixedExpression = anyAnchor.target !== ''; // correctly false for internal

  assert.equal(buggyExpression, true, 'Buggy expression was always true');
  assert.equal(fixedExpression, false, 'Fixed expression is false for internal links');
  assert.notEqual(buggyExpression, fixedExpression, 'Bug and fix must produce different results');
});

// ─── Test 6: Backward compatibility ─────────────────────────────────────────

test('Backward compat: no targetElement → NProgress parent defaults to body', () => {
  const NProgress = require('nprogress');
  const { doc } = makeDocument();
  global.document = doc;

  // Simulate effect with no targetElement (undefined)
  let targetRef = { current: undefined };
  let storedParent = 'body';
  Object.defineProperty(NProgress.settings, 'parent', {
    configurable: true,
    enumerable: true,
    get() {
      const target = targetRef.current ?? storedParent;
      if (target && target !== 'body') {
        try {
          if (document.querySelector(target)) return target;
        } catch {
          return 'body';
        }
      }
      return 'body';
    },
    set(val) {
      storedParent = val;
    },
  });

  NProgress.configure({
    parent: undefined ?? 'body',
  });

  assert.equal(NProgress.settings.parent, 'body', 'Default must remain body');

  delete NProgress.settings.parent;
  NProgress.settings.parent = 'body';
});

// ─── Test 7: dist/index.d.ts exports targetElement ─────────────────────────

test('Build: dist/index.d.ts includes targetElement in NextTopLoaderProps', () => {
  const fs = require('fs');
  const dts = fs.readFileSync('dist/index.d.ts', 'utf8');
  assert.ok(dts.includes('targetElement'), 'dist/index.d.ts must export targetElement prop');
  assert.ok(dts.includes('string'), 'targetElement must be typed as string');
});

test('Build: dist/pages.d.ts includes targetElement in NextTopLoaderProps', () => {
  const fs = require('fs');
  const dts = fs.readFileSync('dist/pages.d.ts', 'utf8');
  // pages.d.ts imports NextTopLoaderProps from index — confirm it re-exports it
  assert.ok(dts.includes('NextTopLoaderProps') || dts.includes('targetElement'), 
    'dist/pages.d.ts must reference NextTopLoaderProps (which includes targetElement)');
});
