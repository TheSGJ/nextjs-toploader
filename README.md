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
import { PagesTopLoader } from 'nextjs-toploader';

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

import { useRouter } from 'nextjs-toploader';
```

Then simply use it in your code for example:

```js
const router = useRouter();
router.push('/some-page');
```

### `useRouter` hook usage with `pages/_app.js` for `pages` folder structure

For triggering TopLoader when using `useRouter` add `<PagesTopLoader />` to your `return()` in `MyApp()` :

```js
import { PagesTopLoader } from 'nextjs-toploader';

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

| **Name**          | **Type**          | **Default Value**                                                                                                                                   |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color`           | `string`          | `"#29d"`                                                                                                                                            |
| `initialPosition` | `number`          | `0.08`                                                                                                                                              |
| `crawlSpeed`      | `number`          | `200`                                                                                                                                               |
| `height`          | `number`          | `3`                                                                                                                                                 |
| `crawl`           | `boolean`         | `true`                                                                                                                                              |
| `showSpinner`     | `boolean`         | `true`                                                                                                                                              |
| `easing`          | `string`          | `"ease"`                                                                                                                                            |
| `speed`           | `number`          | `200`                                                                                                                                               |
| `shadow`          | `string \| false` | `"0 0 10px ${color}, 0 0 5px ${color}"`                                                                                                             |
| `template`        | `string`          | `"<div class=\"bar\" role=\"bar\"><div class=\"peg\"></div></div><div class=\"spinner\" role=\"spinner\"><div class=\"spinner-icon\"></div></div>"` |
| `zIndex`          | `number`          | `1600`                                                                                                                                              |
| `showAtBottom`    | `boolean`         | `false`                                                                                                                                             |

## Contributors

### Code Contributors

This project was made possible thanks to the contributions of its code contributors.

<img src="https://opencollective.com/nextjs-toploader/contributors.svg?width=890&button=false" />

### Financial Contributors

We extend a huge thanks to our financial contributor for helping us sustain this community

<a href="https://sentry.io">
  <svg xmlns="http://www.w3.org/2000/svg" class="css-lfbo6j e1igk8x04" viewBox="0 0 222 66" width="200" height="60"><path d="M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z" transform="translate(11, 11)" fill="#362d59"/></svg>
</a>

---

Support this project with your organization. Your logo will show up here with a link to your website. You can Support this project on Open Collective or Equivalent Method from the below

UPI ID: thesgj@upi (International UPI ID)

[![Sponsor me on GitHub](https://img.shields.io/badge/Sponsor%20me%20on-GitHub-brightgreen)](https://github.com/sponsors/TheSGJ)

[!["Buy Me A Coffee"](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/thesgj)

[![OpenCollective](https://opencollective.com/webpack/donate/button.png?color=blue)](https://opencollective.com/nextjs-toploader)
