/* eslint-disable max-len */

/**
 *
 * NextTopLoader
 *
 */

/* eslint-disable prefer-const */
/* eslint-disable quotes */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as NProgress from 'nprogress';
export type NextTopLoaderProps = {
  /**
   * Color for the TopLoader.
   * @default "#29d"
   */
  color?: string;
  /**
   * The initial position for the TopLoader in percentage, 0.08 is 8%.
   * @default 0.08
   */
  initialPosition?: number;
  /**
   * The increament delay speed in milliseconds.
   * @default 200
   */
  crawlSpeed?: number;
  /**
   * The height for the TopLoader in pixels (px).
   * @default 3
   */
  height?: number;
  /**
   * Auto increamenting behaviour for the TopLoader.
   * @default true
   */
  crawl?: boolean;
  /**
   * To show spinner or not.
   * @default true
   */
  showSpinner?: boolean;
  /**
   * Animation settings using easing (a CSS easing string).
   * @default "ease"
   */
  easing?: string;
  /**
   * Animation speed in ms for the TopLoader.
   * @default 200
   */
  speed?: number;
  /**
   * Defines a shadow for the TopLoader.
   * @default "0 0 10px ${color},0 0 5px ${color}"
   *
   * @ you can disable it by setting it to `false`
   */
  shadow?: string | false;
  /**
   * Defines a template for the TopLoader.
   * @default "<div class="bar" role="bar"><div class="peg"></div></div>
   * <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>"
   */
  template?: string;
  /**
   * Defines zIndex for the TopLoader.
   * @default 1600
   *
   */
  zIndex?: number;
  /**
   * To show the TopLoader at bottom.
   * @default false
   *
   */
  showAtBottom?: boolean;
};

const NextTopLoader = ({
  color: propColor,
  height: propHeight,
  showSpinner,
  crawl,
  crawlSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  template,
  zIndex = 1600,
  showAtBottom = false,
}: NextTopLoaderProps) => {
  const defaultColor = '#29d';
  const defaultHeight = 3;

  const color = propColor ?? defaultColor;
  const height = propHeight ?? defaultHeight;

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    !shadow && shadow !== undefined
      ? ''
      : shadow
      ? `box-shadow:${shadow}`
      : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  // Check if to show at bottom
  const positionStyle = showAtBottom ? 'bottom: 0;' : 'top: 0;';
  const spinnerPositionStyle = showAtBottom ? 'bottom: 15px;' : 'top: 15px;';
  
  const styles = (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:${zIndex};${positionStyle}left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:${zIndex};${spinnerPositionStyle}right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  React.useEffect(() => {
    NProgress.configure({
      showSpinner: showSpinner ?? true,
      trickle: crawl ?? true,
      trickleSpeed: crawlSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? 'ease',
      speed: speed ?? 200,
      template:
        template ??
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
    });

    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash && currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
        );
      }
      return false;
    }

    // eslint-disable-next-line no-var
    var npgclass = document.querySelectorAll('html');
    function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== 'a') {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }
    function handleClick(event: MouseEvent) {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl) {
          const currentUrl = window.location.href;
          // const newUrl = (anchor as HTMLAnchorElement).href;
          const isExternalLink = (anchor as HTMLAnchorElement).target === '_blank';
          const isBlob = newUrl.startsWith('blob:');
          const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);
          if (newUrl === currentUrl || isAnchor || isExternalLink || isBlob || event.ctrlKey) {
            NProgress.start();
            NProgress.done();
            [].forEach.call(npgclass, function (el: Element) {
              el.classList.remove('nprogress-busy');
            });
          } else {
            NProgress.start();
            (function (history) {
              const pushState = history.pushState;
              history.pushState = function () {
                NProgress.done();
                [].forEach.call(npgclass, function (el: Element) {
                  el.classList.remove('nprogress-busy');
                });
                // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
                return pushState.apply(history, arguments as any);
              };
            })(window.history);
          }
        }
      } catch (err) {
        // Log the error in development only!
        // console.log('NextTopLoader error: ', err);
        NProgress.start();
        NProgress.done();
      }
    }

    // Add the global click event listener
    document.addEventListener('click', handleClick);

    // Clean up the global click event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return styles;
};
export default NextTopLoader;

NextTopLoader.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  showSpinner: PropTypes.bool,
  crawl: PropTypes.bool,
  crawlSpeed: PropTypes.number,
  initialPosition: PropTypes.number,
  easing: PropTypes.string,
  speed: PropTypes.number,
  template: PropTypes.string,
  shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  zIndex: PropTypes.number,
  showAtBottom: PropTypes.bool,
};
