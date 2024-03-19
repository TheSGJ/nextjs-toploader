# Next Js TopLoader

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

For rendering add `<NextTopLoader />` to your `return()` in `MyApp()`:

```js
import NextTopLoader from 'nextjs-toploader';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextTopLoader />
      <Component {...pageProps} />;
    </>
  );
}
```

### Usage with React, Vite React or any other React Based Framework

For rendering add `<NextTopLoader />` to your `return()` inside the <Router><Router/> component in `App()` in your App.js:

```js
import NextTopLoader from 'nextjs-toploader';
const App = () => {
  return (
    <div>
    <Router>
      <NextTopLoader />
    <Routes>
    {/* Your Routes Here */}
    </Routes>
    </Router>
    </div>
  )
}

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

---

UPI ID: thesgj@sbi

[![Sponsor me on GitHub](https://img.shields.io/badge/Sponsor%20me%20on-GitHub-brightgreen)](https://github.com/sponsors/TheSGJ)

[!["Buy Me A Coffee"](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/thesgj)
