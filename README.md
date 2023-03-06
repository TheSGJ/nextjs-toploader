# Next Js TopLoader

- A Next.js Top Loading Bar component made using nprogress, works with Next.js 13.

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

### Usage with `pages/_app.js` for pages folder structure

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

### Default Configuration

If no props are passed to `<NextTopLoader />`, below is the default configuration applied.

```jsx
<NextNProgress
  color="#29D"
  initialPosition={0.08}
  crawlSpeed={200}
  height={3}
  crawl={true}
  showSpinner={true}
  easing="ease"
  speed={200}
/>
```

- `color`: to change the default color of TopLoader.
- `initialPosition`: to change initial position for the TopLoader in percentage, : `0.08 = 8%`.
- `crawlSpeed`: increament delay speed in `ms`.
- `speed`: animation speed for the TopLoader in `ms`
- `easing`: animation settings using easing (a CSS easing string).
- `height`: height of TopLoader in `px`.
- `crawl`: auto increamenting behaviour for the TopLoader.
- `showSpinner`: to show spinner or not.
