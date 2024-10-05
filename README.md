# <img src="https://images.opencollective.com/nextjs-toploader/070e1d1/logo/256.png?height=256" alt="NextJS TopLoader" width="50" height="50" style="vertical-align:middle; margin-right:10px"/> Next Js TopLoader

- A Next.js Top Loading Bar component made using nprogress, works with Next.js 14 and React.

[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/nextjs-toploader)
[![NPM Downloads](https://img.shields.io/npm/dm/nextjs-toploader?&style=flat-square)](https://www.npmjs.com/package/nextjs-toploader)

## Install

using npm:

```bash
npm install nextjs-toploader
```

using yarn:

```bash
yarn add nextjs-toploader
```

## Usage

import using:

```js
import NextTopLoader from 'nextjs-toploader';
```

### Usage with `app/layout.js` for `app` folder structure

For rendering add `<NextTopLoader />` to your `return()` inside the `<body></body>` of `RootLayout()`:

```js
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
```

### Usage with `pages/_app.js` for `pages` folder structure

For rendering add `<PagesTopLoader />` to your `return()` in `MyApp()` (Recommended):

```js
import { PagesTopLoader } from 'nextjs-toploader/pages';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <PagesTopLoader />
      <Component {...pageProps} />;
    </>
  );
}
```

You can also use `<NextTopLoader />` in `pages` router, but it's recommended to use `<PagesTopLoader />` for `useRouter` hook support from `nextjs-toploader` version 2.6.12 onwards

## Compatibility with `useRouter` hook

### `useRouter` hook usage with `app/layout.js` for `app` folder structure

For triggering TopLoader when using `useRouter` hook (app router):

```js
// Import the useRouter hook from nextjs-toploader to trigger the TopLoader

import { useRouter } from 'nextjs-toploader/app';
```

Then simply use it in your code for example:

```js
const router = useRouter();
router.push('/some-page');
```

### `useRouter` hook usage with `pages/_app.js` for `pages` folder structure

For triggering TopLoader when using `useRouter` add `<PagesTopLoader />` to your `return()` in `MyApp()` :

```js
import { PagesTopLoader } from 'nextjs-toploader/pages';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <PagesTopLoader />
      <Component {...pageProps} />;
    </>
  );
}
```

---

### Usage with React, Vite React or any other React Based Framework

For rendering add `<NextTopLoader />` to your `return()` inside the <Router><Router/> component in `App()` in your App.js:

```js
import NextTopLoader from 'nextjs-toploader';
const App = () => {
  return (
    <div>
      <Router>
        <NextTopLoader />
        <Routes>{/* Your Routes Here */}</Routes>
      </Router>
    </div>
  );
};

export default App;
```

### Default Configuration

If no props are passed to `<NextTopLoader />`, below is the default configuration applied.

```jsx
<NextTopLoader
  color="#2299DD"
  initialPosition={0.08}
  crawlSpeed={200}
  height={3}
  crawl={true}
  showSpinner={true}
  easing="ease"
  speed={200}
  shadow="0 0 10px #2299DD,0 0 5px #2299DD"
  template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  zIndex={1600}
  showAtBottom={false}
/>
```

- `color`: to change the default color of TopLoader.
- `initialPosition`: to change initial position for the TopLoader in percentage, : `0.08 = 8%`.
- `crawlSpeed`: increment delay speed in `ms`.
- `speed`: animation speed for the TopLoader in `ms`
- `easing`: animation settings using easing (a CSS easing string).
- `height`: height of TopLoader in `px`.
- `crawl`: auto incrementing behavior for the TopLoader.
- `showSpinner`: to show spinner or not.
- `shadow`: a smooth shadow for the TopLoader. (set to `false` to disable it)
- `template`: to include custom HTML attributes for the TopLoader.
- `zIndex`: defines zIndex for the TopLoader.
- `showAtBottom`: To show the TopLoader at bottom. (increase height for the TopLoader to ensure it's visibility at the mobile devices)

#### `NextTopLoaderProps` (props passed to the TopLoader)

| **Name**            | **Type**          | **Default Value**                                                                                                                       |
| ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `color`             | `string`          | `"#2299DD"`                                                                                                                             |
| `initialPosition`   | `number`          | `0.08`                                                                                                                                  |
| `crawlSpeed`        | `number`          | `200`                                                                                                                                   |
| `height`            | `number`          | `3`                                                                                                                                     |
| `crawl`             | `boolean`         | `true`                                                                                                                                  |
| `showSpinner`       | `boolean`         | `true`                                                                                                                                  |
| `easing`            | `string`          | `"ease"`                                                                                                                                |
| `speed`             | `number`          | `200`                                                                                                                                   |
| `shadow`            | `string \| false` | `"0 0 10px #2299DD,0 0 5px #2299DD"`                                                                                                    |
| `template`          | `string`          | `"<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>"` |
| `zIndex`            | `number`          | `1600`                                                                                                                                  |
| `showAtBottom`      | `boolean`         | `false`                                                                                                                                 |
| `showForHashAnchor` | `boolean`         | `true`                                                                                                                                  |

## Contributors

### Code Contributors

This project was made possible thanks to the contributions of its code contributors.

<img src="https://opencollective.com/nextjs-toploader/contributors.svg?width=890&button=false" />

### Financial Contributors

---

Support this project with your organization. Your logo will show up here with a link to your website. You can Support this project on Open Collective or Equivalent Method from the below

UPI ID: thesgj@upi (International UPI ID)

[![Sponsor me on GitHub](https://img.shields.io/badge/Sponsor%20me%20on-GitHub-brightgreen)](https://github.com/sponsors/TheSGJ)

[!["Buy Me A Coffee"](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/thesgj)

[![OpenCollective](https://opencollective.com/webpack/donate/button.png?color=blue)](https://opencollective.com/nextjs-toploader)
